using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;
using TeacherDidac.Common.Constants;
using TeacherDidac.Common.Enums;
using TeacherDidac.Common.Extentions;
using TeacherDidac.Domain.Entities.Firebase;
using TeacherDidac.Persistance.Firebase.Constants;

namespace TeacherDidac.Persistance.Firebase.Repositories
{
    public class SessionRepository : FirebaseDataAccess, ISessionRepository
    {
        public SessionRepository(IConfiguration config) : base(config)
        {

        }

        public async Task<Session> GetAsync(string userId, string id)
        {
            DocumentReference docRef = await GetDocRefAsync(userId, id);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            var session = snapshot.ConvertTo<Session>();

            return session;
        }

        public async Task<SessionCard> GetSessionCardAsync(string userId, string sessionId, string sessionCardId)
        {
            DocumentReference docRef = await GetSessionCardDocRefAsync(userId, sessionId, sessionCardId);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            var sessionCard = snapshot.ConvertTo<SessionCard>();

            return sessionCard;
        }

        public async Task<string> StartAsync(string userId, string deckId)
        {
            return await Transactional(async () =>
            {
                var session = new Session
                {
                    DeckId = deckId,
                    StartTime = Timestamp.FromDateTime(DateTime.UtcNow)
                };

                var docRef = await _db.Collection(Collection.Player).Document(userId)
                    .Collection(Collection.Session).AddAsync(session);

                //TODO return empty string if creating session failed

                return docRef.Id;
            });
        }

        public async Task EndAsync(string userId, string sessionId)
        {
            await Transactional<string>(async () =>
            {
                Session session = await GetAsync(userId, sessionId);

                if (session.UserId != userId)
                    throw new UnauthorizedAccessException();

                DocumentReference docRef = _db.Collection(Collection.Player).Document(userId)
                                               .Collection(Collection.Session).Document(sessionId);

                // TODO handle session does not exist

                _batch.Update(docRef, new Dictionary<string, object> { { nameof(Session.EndTime).ToCamelCase(), Timestamp.FromDateTime(DateTime.UtcNow) } });

                return null;
            });
        }

        public async Task<string> StartCardAsync(string userId, string sessionId, string cardId)
        {
            return await Transactional(async () =>
            {
                var sessionCard = new SessionCard
                {
                    UserId = userId,
                    CardId = cardId,
                    StartTime = Timestamp.FromDateTime(DateTime.UtcNow)
                };

                DocumentReference docRef = await _db.Collection(Collection.Player).Document(userId)
                    .Collection(Collection.Session).Document(sessionId)
                    .Collection(Collection.SessionCard).AddAsync(sessionCard);

                return docRef.Id;
            });
        }

        public async Task EndCardAsync(string userId, string sessionId, string sessionCardId, bool? isCorrect = null)
        {
            await Transactional<string>(async () =>
            {
                DocumentReference docRef = await GetSessionCardDocRefAsync(userId, sessionId, sessionCardId, (snapshot) =>
                {
                    var sessionCard = snapshot.ConvertTo<SessionCard>();
                    if (sessionCard.EndTime is not null)
                        throw new Exception("Endtime already set");
                });

                var updates = new Dictionary<string, object>
                {
                    { nameof(SessionCard.EndTime).ToCamelCase(), Timestamp.FromDateTime(DateTime.UtcNow) }
                };

                if (isCorrect is not null)
                    updates.Add(nameof(SessionCard.IsCorrect).ToCamelCase(), isCorrect.Value);

                _batch.Update(docRef, updates);

                return null;
            });
        }

        public async Task SetCardInput(string sessionId, string sessionCardId, string userId, FeedbackOptions feedback)
        {
            await Transactional<string>(async () =>
            {
                var updates = new Dictionary<string, object>
                {
                    { nameof(SessionCard.Feedback).ToCamelCase(), feedback.ToString() }
                };

                if (feedback == FeedbackOptions.Again)
                    updates.Add(nameof(SessionCard.IsCorrect).ToCamelCase(), false);
                else
                    updates.Add(nameof(SessionCard.IsCorrect).ToCamelCase(), true);

                DocumentReference docRef = await GetSessionCardDocRefAsync(userId, sessionId, sessionCardId);
                _batch.Update(docRef, updates);

                return null;
            });
        }

        private async Task<DocumentReference> GetDocRefAsync(string userId, string sessionId)
        {
            DocumentReference docRef = _db.Collection(Collection.Player).Document(userId)
                .Collection(Collection.Session).Document(sessionId);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                throw new KeyNotFoundException("sessionCard not found");

            return docRef;
        }

        private async Task<DocumentReference> GetSessionCardDocRefAsync(string userId, string sessionId, string sessionCardId, Action<DocumentSnapshot> validationCallback = null)
        {

            DocumentReference docRef = _db.Collection(Collection.Player).Document(userId)
                .Collection(Collection.Session).Document(sessionId)
                .Collection(Collection.SessionCard).Document(sessionCardId);


            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                throw new KeyNotFoundException("sessionCard not found");

            if (validationCallback is not null)
                validationCallback(snapshot);

            return docRef;
        }

    }
}

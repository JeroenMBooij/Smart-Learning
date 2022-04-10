using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;
using TeacherDidac.Common.Constants;
using TeacherDidac.Common.Extentions;
using TeacherDidac.Domain.Entities.Firebase;
using TeacherDidac.Persistance.Firebase.Constants;

namespace TeacherDidac.Persistance.Firebase.Repositories
{
    public class CardRepository : FirebaseDataAccess, ICardRepository
    {
        public CardRepository(IConfiguration config) : base(config)
        {
        }

        public async Task<Card> GetCardAsync(string deckId, string cardId)
        {
            DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                .Collection(Collection.Cards).Document(cardId);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                return null;

            var card = snapshot.ConvertTo<Card>();
            card.Id = snapshot.Id;

            return card;
        }

        public async Task<PlayerCard> GetPlayerCardAsync(string deckId, string cardId, string userId)
        {
            QuerySnapshot querySnapshot = await _db.Collection(Collection.Decks).Document(deckId)
                .Collection(Collection.Cards).Document(cardId)
                .Collection(Collection.PlayerCard).WhereEqualTo(nameof(PlayerCard.UserId).ToCamelCase(), userId)
                .GetSnapshotAsync();

            if (querySnapshot.Count == 0)
                return null;

            PlayerCard playerCard = null;
            foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
            {
                playerCard = documentSnapshot.ConvertTo<PlayerCard>();
                playerCard.Id = documentSnapshot.Id;
                break;
            }

            return playerCard;
        }



        public async Task<PlayerCard> GetNextPlayerCardAsync(string deckId, string userId)
        {
            QuerySnapshot querySnapshot = await _db.CollectionGroup(Collection.PlayerCard)
                .WhereEqualTo(nameof(PlayerCard.DeckId).ToCamelCase(), deckId)
                .WhereEqualTo(nameof(PlayerCard.UserId).ToCamelCase(), userId)
                .WhereEqualTo(nameof(PlayerCard.Planning).ToCamelCase(), PlanningState.Due)
                .GetSnapshotAsync();

            if (querySnapshot.Count == 0)
                return null;

            PlayerCard document = null;
            foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
            {
                document = documentSnapshot.ConvertTo<PlayerCard>();
                document.Id = documentSnapshot.Id;
                break;
            }

            return document;
        }

        public async Task<bool> UpdateCardFieldAsync(string deckId, string cardId, string field, object value)
        {
            return await Transactional(async () =>
            {
                DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                    .Collection(Collection.Cards).Document(cardId);

                DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
                if (snapshot.Exists == false)
                    return false;

                _batch.Update(docRef, new Dictionary<string, object> { { field, value } });

                return true;
            });
        }

        public async Task<bool> UpdatePlayerCardFieldAsync(PlayerCard playerCard, string field, object value)
        {
            return await UpdatePlayerCardFieldAsync(playerCard.DeckId, playerCard.CardId, playerCard.Id, field, value);
        }

        public async Task<bool> UpdatePlayerCardFieldAsync(string deckId, string cardId, string playerCardId, string field, object value)
        {
            return await Transactional(async () =>
            {
                DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                .Collection(Collection.Cards).Document(cardId)
                .Collection(Collection.PlayerCard).Document(playerCardId);

                DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
                if (snapshot.Exists == false)
                    return false;

                _batch.Update(docRef, new Dictionary<string, object> { { field, value } });

                return true;
            });
        }

        public async Task<bool> DeletePlayerCardFieldAsync(string deckId, string cardId, string playerCardId, string field)
        {
            return await Transactional(async () =>
            {
                DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                    .Collection(Collection.Cards).Document(cardId)
                    .Collection(Collection.PlayerCard).Document(playerCardId);

                DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
                if (snapshot.Exists == false)
                    return false;

                Dictionary<string, object> updates = new Dictionary<string, object>
                {
                    { field, FieldValue.Delete }
                };

                _batch.Update(docRef, updates);

                return true;
            });
        }

        public async Task<bool> DeletePlayerCardFieldAsync(PlayerCard playerCard, string field)
        {
            return await DeletePlayerCardFieldAsync(playerCard.DeckId, playerCard.CardId, playerCard.UserId, field);
        }
    }
}

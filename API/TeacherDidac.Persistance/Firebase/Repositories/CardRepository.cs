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

        public async Task<Card> GetCard(string deckId, string cardId)
        {
            DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                .Collection(Collection.Cards).Document(cardId);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                return null;

            var card = snapshot.ConvertTo<Card>();

            return card;
        }

        public async Task<PlayerCard> GetPlayerCard(string deckId, string cardId, string playerCardId)
        {
            DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                .Collection(Collection.Cards).Document(cardId)
                .Collection(Collection.PlayerCards).Document(playerCardId);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                return null;

            var playerCard = snapshot.ConvertTo<PlayerCard>();

            return playerCard;
        }



        public async Task<PlayerCard> GetNextPlayerCard(string deckId, string userId)
        {
            QuerySnapshot querySnapshot = await _db.CollectionGroup(Collection.PlayerCards)
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
                break;
            }

            return document;
        }

        public async Task<bool> UpdateCardField(string deckId, string cardId, string field, object value)
        {
            DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                .Collection(Collection.Cards).Document(cardId);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                return false;

            await docRef.UpdateAsync(field, value);
            return true;
        }

        public async Task<bool> UpdatePlayerCardField(string deckId, string cardId, string playerCardId, string field, object value)
        {
            DocumentReference docRef = _db.Collection(Collection.Decks).Document(deckId)
                .Collection(Collection.Cards).Document(cardId)
                .Collection(Collection.PlayerCards).Document(playerCardId);

            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                return false;

            await docRef.UpdateAsync(field, value);
            return true;
        }
    }
}

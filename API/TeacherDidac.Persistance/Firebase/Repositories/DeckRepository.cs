using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;
using TeacherDidac.Domain.Entities.Firebase;
using TeacherDidac.Persistance.Firebase.Constants;

namespace TeacherDidac.Persistance.Firebase.Repositories
{
    public class DeckRepository : FirebaseDataAccess, IDeckRepository
    {
        public DeckRepository(IConfiguration config) : base(config)
        {
        }

        public async Task<Deck> GetDeck(string id, bool eager = true)
        {
            DocumentReference docRef = _db.Collection(Collection.Decks).Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists == false)
                return null;

            var deck = snapshot.ConvertTo<Deck>();
            deck.Id = snapshot.Id;

            if (eager)
                deck.Cards = await docRef.IncludeAsync<Card>(Collection.Cards);

            return deck;
        }

        public async Task<bool> UpdateDeckField(string id, string field, string value)
        {
            return await Transactional(async () =>
            {
                DocumentReference docRef = _db.Collection(Collection.Decks).Document(id);
                DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
                if (snapshot.Exists == false)
                    return false;

                _batch.Update(docRef, new Dictionary<string, object> { { field, value } });

                return true;
            });
        }


    }
}

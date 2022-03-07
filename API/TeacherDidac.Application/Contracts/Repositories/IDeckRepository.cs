using System.Threading.Tasks;
using TeacherDidac.Domain.Entities.Firebase;

namespace TeacherDidac.Application.Contracts.Repositories
{
    public interface IDeckRepository
    {
        Task<Deck> GetDeck(string id, bool eager = true);
        Task<bool> UpdateDeckField(string id, string field, string value);
    }
}
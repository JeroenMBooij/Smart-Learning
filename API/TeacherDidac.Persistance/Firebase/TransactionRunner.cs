using System.Threading.Tasks;
using TeacherDidac.Application.Contracts.Repositories;

namespace TeacherDidac.Persistance.Firebase
{
    public class TransactionRunner : ITransactionRunner
    {
        public void Start()
        {
            FirebaseDataAccess.StartTransaction();
        }

        public void Rollback()
        {
            FirebaseDataAccess.RollbackTransaction();
        }

        public async Task Commit()
        {
            await FirebaseDataAccess.CommitTransaction();
        }
    }
}

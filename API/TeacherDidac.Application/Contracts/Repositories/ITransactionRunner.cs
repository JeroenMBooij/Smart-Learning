using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Application.Contracts.Repositories
{
    public interface ITransactionRunner
    {
        void Start();
        void Rollback();
        Task Commit();
    }
}

using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Persistance.Firebase.Repositories
{
    public class TeamRepository : FirebaseDataAccess
    {
        public TeamRepository(IConfiguration config) : base(config)
        {
        }

        /*public Team GetTeam(string teamId)
        {
            /// TODO check if we can use the custom token with requests to firebase instead of using Google Service Account
        }*/
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeacherDidac.Scheduler.Firebase.Cards;

namespace TeacherDidac.Scheduler
{
    public class Entrypoint
    {
        private readonly IFirebaseCardScheduler _cardScheduler;

        public Entrypoint(IFirebaseCardScheduler cardScheduler)
        {
            _cardScheduler = cardScheduler;
        }

        public void Run(String[] args)
        {
            Console.WriteLine("Starting Firebase card scheduler");

            _cardScheduler.Init().Wait();

            Console.WriteLine("application stopped");
        }


    }
}

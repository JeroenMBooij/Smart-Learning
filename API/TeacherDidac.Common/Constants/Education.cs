using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Common.Constants
{
    public static class EducationState
    {
        public const string New = "new";
        public const string Sleeping = "sleeping";
    }

    public static class EducationPhase
    {
        public const string Learning = "learning";
        public const string Graduate = "graduate";
        public const string Relearn = "relearn";
        public const string Retired = "retired";

    }

    public static class PlanningState
    {
        public const string Due = "due";
        public const string Scheduled = "scheduled";
        public const string UnScheduled = "unscheduled";
    }
}

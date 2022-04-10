using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Common.Extentions
{
    public static class MathExtensions
    {
        public static decimal ToPercent(this int value)
        {
            return value / 100;
        }
    }
}

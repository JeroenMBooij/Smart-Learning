using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Infrastructure.Transcribe
{
    public class TranscribeResult
    {
        public string[] Predictions { get; set; }
        public decimal[] Probabilities { get; set; }
    }
}

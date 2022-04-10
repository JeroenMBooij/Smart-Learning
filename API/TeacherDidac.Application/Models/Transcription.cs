using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeacherDidac.Application.Models
{
    public class Transcription
    {
        public string CardId { get; set; }
        public string CorrectValue { get; set; }
        public string RecognizedValue { get; set; }
        public decimal Confidence { get; set; }
    }
}

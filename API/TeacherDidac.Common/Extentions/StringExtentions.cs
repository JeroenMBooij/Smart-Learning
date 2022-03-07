using System.Text.Json;

namespace TeacherDidac.Common.Extentions
{
    public static class StringExtentions
    {
        public static string ToCamelCase(this string property)
        {
            return JsonNamingPolicy.CamelCase.ConvertName(property);
        }
    }
}

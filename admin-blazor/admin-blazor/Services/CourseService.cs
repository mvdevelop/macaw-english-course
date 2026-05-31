using System.Net.Http.Json;
using admin_blazor.Models;

namespace admin_blazor.Services
{
    public class CourseService
    {
        private readonly HttpClient _http;
        public CourseService(HttpClient http) => _http = http;

        public async Task<List<Course>> GetAllAsync()
        {
            try
            {
                return await _http.GetFromJsonAsync<List<Course>>("api/courses") ?? new();
            }
            catch { return new(); }
        }

        public async Task<Course?> GetByIdAsync(string id)
        {
            try
            {
                return await _http.GetFromJsonAsync<Course>($"api/courses/{id}");
            }
            catch { return null; }
        }

        public async Task<(bool success, string? error)> CreateAsync(Course course)
        {
            try
            {
                var response = await _http.PostAsJsonAsync("api/courses", course);
                if (response.IsSuccessStatusCode) return (true, null);
                var msg = await response.Content.ReadAsStringAsync();
                return (false, msg);
            }
            catch (Exception ex) { return (false, ex.Message); }
        }

        public async Task<(bool success, string? error)> UpdateAsync(string id, Course course)
        {
            try
            {
                var response = await _http.PutAsJsonAsync($"api/courses/{id}", course);
                if (response.IsSuccessStatusCode) return (true, null);
                var msg = await response.Content.ReadAsStringAsync();
                return (false, msg);
            }
            catch (Exception ex) { return (false, ex.Message); }
        }

        public async Task<(bool success, string? error)> DeleteAsync(string id)
        {
            try
            {
                var response = await _http.DeleteAsync($"api/courses/{id}");
                if (response.IsSuccessStatusCode) return (true, null);
                return (false, "Erro ao excluir curso.");
            }
            catch (Exception ex) { return (false, ex.Message); }
        }
    }
}

using System.Net.Http.Json;
using admin_blazor.Models;

namespace admin_blazor.Services
{
    public class StudentService
    {
        private readonly HttpClient _http;
        public StudentService(HttpClient http) => _http = http;

        public async Task<List<Student>> GetAllAsync()
        {
            try
            {
                return await _http.GetFromJsonAsync<List<Student>>("api/students") ?? new();
            }
            catch { return new(); }
        }

        public async Task<Student?> GetByIdAsync(string id)
        {
            try
            {
                return await _http.GetFromJsonAsync<Student>($"api/students/{id}");
            }
            catch { return null; }
        }

        public async Task<(bool success, string? error)> CreateAsync(Student student)
        {
            try
            {
                var response = await _http.PostAsJsonAsync("api/students", student);
                if (response.IsSuccessStatusCode) return (true, null);
                var msg = await response.Content.ReadAsStringAsync();
                return (false, msg);
            }
            catch (Exception ex) { return (false, ex.Message); }
        }

        public async Task<(bool success, string? error)> UpdateAsync(string id, Student student)
        {
            try
            {
                var response = await _http.PutAsJsonAsync($"api/students/{id}", student);
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
                var response = await _http.DeleteAsync($"api/students/{id}");
                if (response.IsSuccessStatusCode) return (true, null);
                return (false, "Erro ao excluir aluno.");
            }
            catch (Exception ex) { return (false, ex.Message); }
        }
    }
}

using System.Net.Http.Json;
using Blazored.LocalStorage;
using admin_blazor.Models;
using Microsoft.AspNetCore.Components.Authorization;

namespace admin_blazor.Services
{
    public class AuthService
    {
        private readonly HttpClient _http;
        private readonly ILocalStorageService _localStorage;
        private readonly AuthenticationStateProvider _authStateProvider;

        public AuthService(HttpClient http, ILocalStorageService localStorage, AuthenticationStateProvider authStateProvider)
        {
            _http = http;
            _localStorage = localStorage;
            _authStateProvider = authStateProvider;
        }

        public async Task<(bool success, string? error)> Login(string email, string password)
        {
            try
            {
                var response = await _http.PostAsJsonAsync("api/auth/login", new LoginRequest { Email = email, Password = password });

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                    if (result != null)
                    {
                        var token = string.IsNullOrEmpty(result.Token) ? "dummy-token-" + Guid.NewGuid().ToString() : result.Token;
                        var adminUser = new AdminUser { Id = result.Id, Name = result.Name, Email = result.Email };

                        await _localStorage.SetItemAsync("adminToken", token);
                        await _localStorage.SetItemAsStringAsync("admin", System.Text.Json.JsonSerializer.Serialize(adminUser));

                        ((Auth.CustomAuthStateProvider)_authStateProvider).NotifyUserLogin(adminUser, token);
                        return (true, null);
                    }
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    return (false, "Email ou senha inválidos.");
                }
                else
                {
                    var msg = await response.Content.ReadAsStringAsync();
                    return (false, string.IsNullOrEmpty(msg) ? "Erro ao fazer login. Tente novamente." : msg);
                }
            }
            catch
            {
                return (false, "Erro ao conectar ao servidor.");
            }

            return (false, "Erro ao fazer login.");
        }

        public async Task Logout()
        {
            await _localStorage.RemoveItemAsync("adminToken");
            await _localStorage.RemoveItemAsync("admin");
            ((Auth.CustomAuthStateProvider)_authStateProvider).NotifyUserLogout();
        }

        public async Task<AdminUser?> GetCurrentUserAsync()
        {
            var adminJson = await _localStorage.GetItemAsync<string>("admin");
            if (string.IsNullOrEmpty(adminJson)) return null;
            return System.Text.Json.JsonSerializer.Deserialize<AdminUser>(adminJson);
        }
    }
}

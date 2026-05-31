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

        public async Task<bool> Login(string email, string password)
        {
            var response = await _http.PostAsJsonAsync("api/auth/login", new LoginRequest { Email = email, Password = password });

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                if (result != null)
                {
                    // For now, if backend doesn't return token, we use a placeholder or the Id
                    var token = string.IsNullOrEmpty(result.Token) ? "dummy-token-" + Guid.NewGuid().ToString() : result.Token;

                    var adminUser = new AdminUser { Id = result.Id, Name = result.Name, Email = result.Email };

                    await _localStorage.SetItemAsync("adminToken", token);
                    await _localStorage.SetItemAsStringAsync("admin", System.Text.Json.JsonSerializer.Serialize(adminUser));

                    ((Auth.CustomAuthStateProvider)_authStateProvider).NotifyUserLogin(adminUser, token);
                    return true;
                }
            }

            return false;
        }

        public async Task Logout()
        {
            await _localStorage.RemoveItemAsync("adminToken");
            await _localStorage.RemoveItemAsync("admin");
            ((Auth.CustomAuthStateProvider)_authStateProvider).NotifyUserLogout();
        }
    }
}

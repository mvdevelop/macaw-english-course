using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using admin_blazor;
using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Authorization;
using admin_blazor.Auth;
using admin_blazor.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure HttpClient for backend API (adjust port if necessary)
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5196/") });

// Add Blazored LocalStorage
builder.Services.AddBlazoredLocalStorage();

// Add Auth Services
builder.Services.AddAuthorizationCore();
builder.Services.AddScoped<CustomAuthStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider>(s => s.GetRequiredService<CustomAuthStateProvider>());
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CourseService>();
builder.Services.AddScoped<StudentService>();

await builder.Build().RunAsync();

using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Notifications.Application.Hubs;
using Notifications.Application.Services;
using Notifications.Core.Abstractions;
using Notifications.Infrastructure;
using Notifications.Infrastructure.Repositories;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;
using SharedLibrary.Middlewares;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();
services.AddSignalR();

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));
services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<NotificationsDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("NotificationDbConnection"));
});

services.AddScoped<INotificationsRepository, NotificationsRepository>();
services.AddScoped<INotificationsService, NotificationsService>();

services.AddHostedService<DeleteOldNotificationsBackgroundService>();


var app = builder.Build();

app.UseMiddleware<ListenToOnlyApiGateway>();

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hub/notifications");

app.Run();
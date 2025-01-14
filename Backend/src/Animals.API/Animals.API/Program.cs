using Animals.Application.Services;
using Animals.Core.Abstractions;
using Animals.Infrastructure;
using Animals.Infrastructure.Consumers;
using Animals.Infrastructure.GrpcServices;
using Animals.Infrastructure.Repositories;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;
using SharedLibrary.Middlewares;
using SharedLibrary.RabbitMQ;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();
services.AddGrpc();

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<AnimalsDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("AnimalsDbConnection"));
});

services.AddScoped<IUserAnimalsRepository, UserAnimalsRepository>();
services.AddScoped<IAnimalsService, AnimalsService>();

services.AddSingleton<IRabbitMQService, RabbitMQService>();
services.AddSingleton<IUserAnimalsConsumer, UserAnimalsConsumer>();

services.AddHostedService<UserAnimalsBackgroundService>();


var app = builder.Build();

app.UseMiddleware<ListenToOnlyApiGateway>();

app.UseCookiePolicy(new CookiePolicyOptions
{
    // MinimumSameSitePolicy = SameSiteMode.Strict,
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGrpcService<AnimalsGrpcService>();

app.Run();
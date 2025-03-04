using Boards.Application.Services;
using Boards.Core.Abstractions;
using Boards.Infrastructure;
using Boards.Infrastructure.GrpcClients;
using Boards.Infrastructure.Protos;
using Boards.Infrastructure.Repositories;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;
using SharedLibrary.Middlewares;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<BoardsDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("BoardsDbConnection"));
});

services.AddGrpcClient<AnimalsProtoService.AnimalsProtoServiceClient>(options =>
{
    options.Address = new Uri("https://localhost:7001");
}).ConfigurePrimaryHttpMessageHandler(() =>    // In production it needs to use HTTPS Sertificate!!!
{
    var handler = new HttpClientHandler();
    handler.ServerCertificateCustomValidationCallback = 
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
    return handler;
});

services.AddScoped<IBoardsRepository, BoardsRepository>();
services.AddScoped<IBoardAnimalsRepository, BoardAnimalsRepository>();

services.AddScoped<IBoardsService, BoardsService>();
services.AddScoped<IBoardAnimalsService, BoardAnimalsService>();

services.AddScoped<AnimalsGrpcClient>();

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

app.Run();
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Requests.Application.Services;
using Requests.Core.Abstractions;
using Requests.Infrastructure;
using Requests.Infrastructure.GrpcClients;
using Requests.Infrastructure.Protos;
using Requests.Infrastructure.Repositories;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;
using SharedLibrary.Middlewares;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<RequestsDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("RequestsDbConnection"));
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

services.AddScoped<IRequestsRepository, RequestsRepository>();

services.AddScoped<IRequestsService, RequestsService>();

services.AddHostedService<DeleteAcceptedRequestsBackgroundService>();

//Grpc
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
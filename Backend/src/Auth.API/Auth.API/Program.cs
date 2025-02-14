using Auth.Application.Services;
using Auth.Core.Abstractions;
using Auth.Infrastructure;
using Auth.Infrastructure.GrpcClients;
using Auth.Infrastructure.Protos;
using Auth.Infrastructure.Publishers;
using Auth.Infrastructure.Repositories;
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
services.AddSwaggerGen(); //Swagger

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<AuthDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("AuthDbConnection"));
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
    
services.AddSingleton<IRabbitMQService, RabbitMQService>();

services.AddScoped<IUsersRepository, UsersRepository>();

services.AddScoped<IPasswordHasher, PasswordHasher>();

services.AddScoped<IJwtProvider, JwtProvider>();

services.AddScoped<IUsersService, UsersService>();

services.AddScoped<IRegisterUserPublisher, RegisterUserPublisher>();
services.AddScoped<IUserAnimalsPublisher, UserAnimalsPublisher>();

services.AddScoped<AnimalsGrpcClient>();


var app = builder.Build();

app.UseMiddleware<ListenToOnlyApiGateway>();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
    options.DocumentTitle = "My Swagger";
});

//app.UseHttpsRedirection();  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//app.UseExceptionMiddleware();

app.UseCookiePolicy(new CookiePolicyOptions
{
    //MinimumSameSitePolicy = SameSiteMode.Strict,
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
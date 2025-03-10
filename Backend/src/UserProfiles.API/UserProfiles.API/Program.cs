using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;
using SharedLibrary.Middlewares;
using SharedLibrary.RabbitMQ;
using UserProfiles.Application.Services;
using UserProfiles.Core.Abstractions;
using UserProfiles.Infrastructure;
using UserProfiles.Infrastructure.Consumers;
using UserProfiles.Infrastructure.GrpcClients;
using UserProfiles.Infrastructure.GrpcServices;
using UserProfiles.Infrastructure.Protos;
using UserProfiles.Infrastructure.Providers;
using UserProfiles.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();
services.AddGrpc().AddJsonTranscoding();
services.AddEndpointsApiExplorer();
services.AddSwaggerGen(); //Swagger

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<UserProfilesDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("UserProfilesDbConnection"));
});

services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = configuration.GetConnectionString("Redis");
});

services.AddGrpcClient<ReviewsProtoService.ReviewsProtoServiceClient>(options =>
{
    options.Address = new Uri("https://localhost:7000");
}).ConfigurePrimaryHttpMessageHandler(() =>    // In production it needs to use HTTPS Sertificate!!!
{
    var handler = new HttpClientHandler();
    handler.ServerCertificateCustomValidationCallback = 
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
    return handler;
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

//Repositories
services.AddScoped<IOwnerProfilesRepository, OwnerProfilesRepository>();
services.AddScoped<ISitterProfilesRepository, SitterProfilesRepository>();

//Services
services.AddScoped<IOwnerProfilesService, OwnerProfilesService>();
services.AddScoped<ISitterProfileService, SitterProfileService>();
services.AddScoped<IImagesService, ImagesService>();
services.AddScoped<IRedisCacheService, RedisCacheService>();
services.AddScoped<IShortSitterProfilesCacheService, ShortSitterProfilesCacheService>();

//Providers
services.AddScoped<IImagesProvider, ImagesProvider>();

//RabbitMQ
services.AddSingleton<IRabbitMQService, RabbitMQService>();
services.AddSingleton<ICreateUserProfileConsumer, CreateUserProfileConsumer>();
services.AddSingleton<IUpdateSitterRatingConsumer, UpdateSitterRatingConsumer>();

//Background Services
services.AddHostedService<CreateUserProfileBackground>();
services.AddHostedService<UpdateSitterRatingBackground>();
services.AddHostedService<ShortSitterProfilesCacheBackgroundService>();

//gRPC
services.AddScoped<ReviewsGrpcClient>();
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

//app.UseHttpsRedirection();

//app.UseExceptionMiddleware();

string infrastructurePath = Path.Combine(Directory
        .GetParent(builder.Environment.ContentRootPath).FullName,
        "UserProfiles.Infrastructure");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(infrastructurePath,"uploads")),
    RequestPath = "/uploads"
});

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
app.MapGrpcService<SittersGrpcService>();

app.Run();
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;
using SharedLibrary.Middlewares;
using SharedLibrary.RabbitMQ;
using UserProfiles.Application.Services;
using UserProfiles.Core.Abstractions;
using UserProfiles.Infrastructure;
using UserProfiles.Infrastructure.Consumers;
using UserProfiles.Infrastructure.Providers;
using UserProfiles.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();
services.AddEndpointsApiExplorer();
services.AddSwaggerGen(); //Swagger

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<UserProfilesDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("UserProfilesDbConnection"));
});


//Repositories
services.AddScoped<IOwnerProfilesRepository, OwnerProfilesRepository>();
services.AddScoped<ISitterProfilesRepository, SitterProfilesRepository>();

//Services
services.AddScoped<IOwnerProfilesService, OwnerProfilesService>();

services.AddScoped<IImagesService, ImagesService>();

//Providers
services.AddScoped<IImagesProvider, ImagesProvider>();

//RabbitMQ
services.AddSingleton<IRabbitMQService, RabbitMQService>();
services.AddSingleton<ICreateUserProfileConsumer, CreateUserProfileConsumer>();
services.AddHostedService<CreateUserProfileBackground>();


var app = builder.Build();

app.UseMiddleware<ListenToOnlyApiGateway>();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
    options.DocumentTitle = "My Swagger";
});

app.UseHttpsRedirection();

//app.UseExceptionMiddleware();

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
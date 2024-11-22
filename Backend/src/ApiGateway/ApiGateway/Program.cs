using ApiGateway.Middlewares;
using Ocelot.Cache.CacheManager;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

services.AddOcelot().AddCacheManager(x => x.WithDictionaryHandle());
services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));


services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();
app.UseMiddleware<AttachSignatureToRequest>();
app.UseOcelot().Wait();

app.Run();
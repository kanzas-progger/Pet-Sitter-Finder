using ApiGateway.Middlewares;
using Microsoft.AspNetCore.CookiePolicy;
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
        // builder.AllowAnyHeader()
        //     .AllowAnyMethod()
        //     .AllowAnyOrigin();
        builder.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("https://localhost:5173");
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
//app.UseCors();
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    //MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});



app.UseCors();
app.UseMiddleware<AttachSignatureToRequest>();
app.UseOcelot().Wait();



app.Run();
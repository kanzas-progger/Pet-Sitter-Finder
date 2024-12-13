using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Reviews.Application.Services;
using Reviews.Core.Abstractions;
using Reviews.Infrastructure;
using Reviews.Infrastructure.GrpcServices;
using Reviews.Infrastructure.Repositories;
using SharedLibrary.Configurations;
using SharedLibrary.DependencyInjection;
using SharedLibrary.Middlewares;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();
services.AddGrpc().AddJsonTranscoding();

services.AddSwaggerGen(); //Swagger

services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));
services.AddJwtAuthenticationScheme(configuration.GetSection(nameof(JwtOptions)));

services.AddDbContext<ReviewsDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("ReviewsDbConnection"));
});

services.AddScoped<IReviewsRepository, ReviewsRepository>();
services.AddScoped<IReviewsService, ReviewsService>();

var app = builder.Build();

app.UseMiddleware<ListenToOnlyApiGateway>();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
    options.DocumentTitle = "My Swagger";
});

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGrpcService<ReviewsGrpcService>();

app.Run();
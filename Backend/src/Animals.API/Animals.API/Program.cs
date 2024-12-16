using Animals.Application.Services;
using Animals.Core.Abstractions;
using Animals.Infrastructure;
using Animals.Infrastructure.Consumers;
using Animals.Infrastructure.GrpcServices;
using Animals.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using SharedLibrary.RabbitMQ;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();
services.AddGrpc();

services.AddDbContext<AnimalsDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("AnimalsDbConnection"));
});

services.AddScoped<IUserAnimalsRepository, UserAnimalsRepository>();

services.AddSingleton<IRabbitMQService, RabbitMQService>();
services.AddSingleton<IUserAnimalsConsumer, UserAnimalsConsumer>();

services.AddHostedService<UserAnimalsBackgroundService>();


var app = builder.Build();

app.MapControllers();
app.MapGrpcService<AnimalsGrpcService>();

app.Run();
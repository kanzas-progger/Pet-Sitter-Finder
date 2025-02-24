FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5004
EXPOSE 7001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Animals.API/Animals.API/Animals.API.csproj", "Animals.API/"]
COPY ["src/PetSitterFinder.SharedLibrary/SharedLibrary/SharedLibrary.csproj", "PetSitterFinder.SharedLibrary/SharedLibrary/"]
COPY ["src/Animals.API/Animals.Application/Animals.Application.csproj", "Animals.Application/"]
COPY ["src/Animals.API/Animals.Core/Animals.Core.csproj", "Animals.Core/"]
COPY ["src/Animals.API/Animals.Infrastructure/Animals.Infrastructure.csproj", "Animals.Infrastructure/"]
RUN dotnet restore "Animals.API/Animals.API.csproj"
COPY ["src/Animals.API", "."]
COPY ["src/PetSitterFinder.SharedLibrary", "../PetSitterFinder.SharedLibrary"]
WORKDIR "/src/Animals.API"
RUN dotnet build "Animals.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Animals.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

RUN mkdir -p /https/
RUN dotnet dev-certs https -ep /https/aspnetapp.pfx -p password123

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

COPY --from=publish /https /https
ENV ASPNETCORE_URLS="http://+:5004;https://+:7001"
ENV ASPNETCORE_HTTPS_PORT=7001
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password123
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT ["dotnet", "Animals.API.dll"]
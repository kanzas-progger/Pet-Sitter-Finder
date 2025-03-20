FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5002
EXPOSE 7002

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/UserProfiles.API/UserProfiles.API/UserProfiles.API.csproj", "UserProfiles.API/"]
COPY ["src/PetSitterFinder.SharedLibrary/SharedLibrary/SharedLibrary.csproj", "PetSitterFinder.SharedLibrary/SharedLibrary/"]
COPY ["src/UserProfiles.API/UserProfiles.Application/UserProfiles.Application.csproj", "UserProfiles.Application/"]
COPY ["src/UserProfiles.API/UserProfiles.Core/UserProfiles.Core.csproj", "UserProfiles.Core/"]
COPY ["src/UserProfiles.API/UserProfiles.Infrastructure/UserProfiles.Infrastructure.csproj", "UserProfiles.Infrastructure/"]
RUN dotnet restore "UserProfiles.API/UserProfiles.API.csproj"
COPY ["src/UserProfiles.API", "."]
COPY ["src/PetSitterFinder.SharedLibrary", "../PetSitterFinder.SharedLibrary"]
WORKDIR "/src/UserProfiles.API"
RUN dotnet build "UserProfiles.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "UserProfiles.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

RUN mkdir -p /https/
RUN dotnet dev-certs https -ep /https/aspnetapp.pfx -p password123

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /https /https
ENV ASPNETCORE_URLS="http://+:5002;https://+:7002"
ENV ASPNETCORE_HTTPS_PORT=7002
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password123
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT ["dotnet", "UserProfiles.API.dll"]

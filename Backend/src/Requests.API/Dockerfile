FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5006
EXPOSE 7004

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Requests.API/Requests.API/Requests.API.csproj", "Requests.API/"]
COPY ["src/PetSitterFinder.SharedLibrary/SharedLibrary/SharedLibrary.csproj", "PetSitterFinder.SharedLibrary/SharedLibrary/"]
COPY ["src/Requests.API/Requests.Application/Requests.Application.csproj", "Requests.Application/"]
COPY ["src/Requests.API/Requests.Core/Requests.Core.csproj", "Requests.Core/"]
COPY ["src/Requests.API/Requests.Infrastructure/Requests.Infrastructure.csproj", "Requests.Infrastructure/"]
RUN dotnet restore "Requests.API/Requests.API.csproj"
COPY ["src/Requests.API", "."]
COPY ["src/PetSitterFinder.SharedLibrary", "../PetSitterFinder.SharedLibrary"]
WORKDIR "/src/Requests.API"
RUN dotnet build "Requests.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Requests.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

RUN mkdir -p /https/
RUN dotnet dev-certs https -ep /https/aspnetapp.pfx -p password123

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /https /https
ENV ASPNETCORE_URLS="http://+:5006;https://+:7004"
ENV ASPNETCORE_HTTPS_PORT=7004
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password123
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT ["dotnet", "Requests.API.dll"]

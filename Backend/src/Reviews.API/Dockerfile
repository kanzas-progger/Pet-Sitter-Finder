FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5003
EXPOSE 7000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Reviews.API/Reviews.API/Reviews.API.csproj", "Reviews.API/"]
COPY ["src/PetSitterFinder.SharedLibrary/SharedLibrary/SharedLibrary.csproj", "PetSitterFinder.SharedLibrary/SharedLibrary/"]
COPY ["src/Reviews.API/Reviews.Application/Reviews.Application.csproj", "Reviews.Application/"]
COPY ["src/Reviews.API/Reviews.Core/Reviews.Core.csproj", "Reviews.Core/"]
COPY ["src/Reviews.API/Reviews.Infrastructure/Reviews.Infrastructure.csproj", "Reviews.Infrastructure/"]
RUN dotnet restore "Reviews.API/Reviews.API.csproj"
COPY ["src/Reviews.API", "."]
COPY ["src/PetSitterFinder.SharedLibrary", "../PetSitterFinder.SharedLibrary"]
WORKDIR "/src/Reviews.API"
RUN dotnet build "Reviews.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Reviews.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
# Создаем директорию для сертификатов и генерируем сертификат
RUN mkdir -p /https/
RUN dotnet dev-certs https -ep /https/aspnetapp.pfx -p password123

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Копируем сертификат из этапа publish
COPY --from=publish /https /https
ENV ASPNETCORE_URLS="http://+:5003;https://+:7000"
ENV ASPNETCORE_HTTPS_PORT=7000
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password123
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT ["dotnet", "Reviews.API.dll"]

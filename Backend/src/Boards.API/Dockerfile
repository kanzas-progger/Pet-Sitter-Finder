FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5005

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Boards.API/Boards.API/Boards.API.csproj", "Boards.API/"]
COPY ["src/PetSitterFinder.SharedLibrary/SharedLibrary/SharedLibrary.csproj", "PetSitterFinder.SharedLibrary/SharedLibrary/"]
COPY ["src/Boards.API/Boards.Application/Boards.Application.csproj", "Boards.Application/"]
COPY ["src/Boards.API/Boards.Core/Boards.Core.csproj", "Boards.Core/"]
COPY ["src/Boards.API/Boards.Infrastructure/Boards.Infrastructure.csproj", "Boards.Infrastructure/"]
RUN dotnet restore "Boards.API/Boards.API.csproj"
COPY ["src/Boards.API", "."]
COPY ["src/PetSitterFinder.SharedLibrary", "../PetSitterFinder.SharedLibrary"]
WORKDIR "/src/Boards.API"
RUN dotnet build "Boards.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Boards.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

RUN mkdir -p /https/
RUN dotnet dev-certs https -ep /https/aspnetapp.pfx -p password123

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /https /https
ENV ASPNETCORE_URLS="http://+:5005"
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password123
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT ["dotnet", "Boards.API.dll"]

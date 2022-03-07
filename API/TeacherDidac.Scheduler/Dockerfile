#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["TeacherDidac.Scheduler/TeacherDidac.Scheduler.csproj", "TeacherDidac.Scheduler/"]
COPY ["TeacherDidac.Persistance/TeacherDidac.Persistance.csproj", "TeacherDidac.Persistance/"]
COPY ["TeacherDidac.Application/TeacherDidac.Application.csproj", "TeacherDidac.Application/"]
COPY ["TeacherDidac.Common/TeacherDidac.Common.csproj", "TeacherDidac.Common/"]
COPY ["TeacherDidac.Domain/TeacherDidac.Domain.csproj", "TeacherDidac.Domain/"]
RUN dotnet restore "TeacherDidac.Scheduler/TeacherDidac.Scheduler.csproj"
COPY . .
WORKDIR "/src/TeacherDidac.Scheduler"
RUN dotnet build "TeacherDidac.Scheduler.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TeacherDidac.Scheduler.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TeacherDidac.Scheduler.dll"]
#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["TeacherDidac.Web/TeacherDidac.Web.csproj", "TeacherDidac.Web/"]
COPY ["TeacherDidac.Persistance/TeacherDidac.Persistance.csproj", "TeacherDidac.Persistance/"]
COPY ["TeacherDidac.Application/TeacherDidac.Application.csproj", "TeacherDidac.Application/"]
COPY ["TeacherDidac.Common/TeacherDidac.Common.csproj", "TeacherDidac.Common/"]
COPY ["TeacherDidac.Domain/TeacherDidac.Domain.csproj", "TeacherDidac.Domain/"]
RUN dotnet restore "TeacherDidac.Web/TeacherDidac.Web.csproj"
COPY . .
WORKDIR "/src/TeacherDidac.Web"
RUN dotnet build "TeacherDidac.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TeacherDidac.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TeacherDidac.Web.dll"]
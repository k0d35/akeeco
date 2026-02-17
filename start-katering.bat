@echo off
title Katering Fullstack (Angular + Spring Boot + MongoDB)
echo ===============================================
echo     🚀 Starting Katering Fullstack Services
echo ===============================================
echo.

REM Ensure Docker Desktop is running
docker version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running or not installed!
    echo Please open Docker Desktop and try again.
    pause
    exit /b
)

REM Start all containers with build
echo 🏗️  Building and starting containers...
docker compose up --build -d

echo.
echo ✅ All services are starting up!
echo -----------------------------------------------
echo 🌐 Frontend: http://localhost:4200
echo ⚙️  Backend:  http://localhost:8080
echo 🍃 MongoDB:  mongodb://localhost:27017/katering
echo -----------------------------------------------
echo.
echo 💡 Tip: Run "stop-katering.bat" to stop all containers.
echo.

pause
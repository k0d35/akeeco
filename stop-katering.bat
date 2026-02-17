@echo off
title Stop Katering Containers
echo ===============================================
echo     🛑 Stopping Katering Fullstack Services
echo ===============================================
echo.

docker compose down

echo ✅ All containers stopped.
pause
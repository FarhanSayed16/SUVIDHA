@echo off
echo ===================================================
echo [ SUVIDHA KIOSK ] - Quick Launcher
echo ===================================================

echo.
echo [1/3] Starting Backend API Gateway and Database...
call docker compose down
call docker compose up --build -d

echo.
echo Waiting 10 seconds for PostgreSQL Initialization...
timeout /t 10 /nobreak >nul

echo.
echo [2/3] Initializing Database Schema and Injecting Mock Data...
docker exec -i suvidha_gateway npx prisma db push --accept-data-loss
cmd /c "docker exec -i suvidha_db psql -U suvidha_user -d suvidha_db < d:\SUVIDHA\gateway\prisma\seed.sql"
echo Database Hydrated.

echo.
echo [3/3] Launching Kiosk and Admin Interfaces...
echo.
echo ===================================================
echo SUCCESS! ENVIRONMENT IS LIVE!
echo ===================================================
echo - The API Gateway is securely mapped to docker:8080
echo.
echo Open a new terminal, navigate to \kiosk-ui and run [ npm run dev ]
echo Open another terminal, navigate to \admin-ui and run [ npm run dev ]
echo ===================================================

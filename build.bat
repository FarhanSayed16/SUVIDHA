@echo off
echo ===================================================
echo [ SUVIDHA KIOSK ] - Master Build Script
echo ===================================================

echo.
echo [1/2] Building Kiosk UI...
cd kiosk-ui
call npm install
call npm run build
echo Kiosk UI Build Complete.
cd ..

echo.
echo [2/2] Building Admin UI...
cd admin-ui
call npm install
call npm run build
echo Admin UI Build Complete.
cd ..

echo.
echo ===================================================
echo COMPLETE: Static assets generated in /dist folders.
echo You may now route NGINX to these edge directories.
echo ===================================================

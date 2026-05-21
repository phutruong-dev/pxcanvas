@echo off
setlocal
title PXcanvas
cd /d "%~dp0"

echo ============================================
echo   PXcanvas - starting dev server
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 goto :no_node

REM Install dependencies if missing
if not exist node_modules goto :install_deps
goto :start_server

:no_node
echo [ERROR] Node.js not found in PATH.
echo Install Node.js 20+ from https://nodejs.org/ then re-run this script.
echo.
pause
exit /b 1

:install_deps
echo [INFO] node_modules not found - running npm install...
echo.
call npm install
if errorlevel 1 (
  echo.
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)
echo.
goto :start_server

:start_server
echo [INFO] Browser will open at http://localhost:3000 in a few seconds.
start "" /b cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"
echo [INFO] Starting Next.js dev server. Close this window to stop.
echo.
call npm run dev

endlocal

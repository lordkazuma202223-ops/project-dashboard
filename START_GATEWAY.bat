@echo off
REM ==========================================================
REM OpenClaw Gateway Wrapper with Full PATH
REM This file sets proper PATH before starting gateway
REM ==========================================================

echo Setting up environment for OpenClaw gateway...

REM Set full PATH with all tools
set "OPENCLAW_PATH=C:\Program Files\GitHub CLI;C:\ProgramData\chocolatey\bin;%OPENCLAW_PATH%"
set "PATH=%OPENCLAW_PATH%;%PATH%"

echo Starting OpenClaw gateway with enhanced PATH...
echo PATH includes:
echo   - GitHub CLI (gh)
echo   - Chocolatey tools (jq, rg, ffmpeg, op)
echo.

REM Start the actual gateway
"C:\Program Files\nodejs\node.exe" "C:\Users\user\AppData\Roaming\npm\node_modules\openclaw\dist\index.js" gateway --port 18789

echo.
echo Gateway stopped. Press any key to restart...
pause >nul
goto :restart

:restart
"C:\Program Files\nodejs\node.exe" "C:\Users\user\AppData\Roaming\npm\node_modules\openclaw\dist\index.js" gateway --port 18789
echo.
echo Gateway stopped. Press any key to restart...
pause >nul
goto :restart

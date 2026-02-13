@echo off
REM ==========================================================
REM Simple Gateway Launcher - Can be edited in Task Scheduler
REM ==========================================================

echo.
echo OpenClaw Gateway Launcher
echo =======================
echo.

REM Full PATH with all tools
set "LAUNCH_PATH=C:\Program Files\GitHub CLI;C:\ProgramData\chocolatey\bin;%PATH%"

REM Start gateway with the full PATH
set "PATH=%LAUNCH_PATH%"
"C:\Program Files\nodejs\node.exe" "C:\Users\user\AppData\Roaming\npm\node_modules\openclaw\dist\index.js" gateway --port 18789

echo.
echo Gateway exited. Press any key to restart...
pause >nul
goto :start

:start
set "PATH=%LAUNCH_PATH%"
"C:\Program Files\nodejs\node.exe" "C:\Users\user\AppData\Roaming\npm\node_modules\openclaw\dist\index.js" gateway --port 18789

goto :eof

@echo off
echo ==========================================================
echo  Restoring OpenClaw Command Access
echo ==========================================================
echo.

echo Checking npm installation...
if exist "C:\Program Files\nodejs\npm.cmd" (
    echo Found npm at: C:\Program Files\nodejs\npm.cmd
    echo Adding to PATH...
    setx PATH "C:\Program Files\nodejs;%PATH%"
    echo.
) else (
    echo ERROR: npm not found at C:\Program Files\nodejs\npm.cmd
    echo Please reinstall Node.js
)

echo Checking OpenClaw CLI...
"C:\Program Files\nodejs\npm.cmd" list -g openclaw 2>nul
if %errorlevel% equ 0 (
    echo.
    echo OpenClaw is installed globally via npm
    echo.
    echo Current npm global packages:
    "C:\Program Files\nodejs\npm.cmd" list -g
) else (
    echo.
    echo OpenClaw is NOT installed globally
    echo.
    echo Attempting to install...
    "C:\Program Files\nodejs\npm.cmd" install -g openclaw
)

echo.
echo ==========================================================
echo  IMPORTANT: RESTART YOUR COMPUTER for PATH changes
echo ==========================================================
echo.
echo After restart, run: openclaw skills check
echo.

pause

@echo off
echo ==========================================================
echo  CRITICAL: Restoring PATH to Working State
echo ==========================================================
echo.

REM Reset PATH to safe default
set "SAFE_PATH=C:\Python310\;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;C:\Program Files\dotnet\;C:\Program Files\Java\jdk1.8.0_301\bin;C:\Program Files\Git\cmd;C:\Users\user\AppData\Local\Programs\Ollama;C:\Users\user\AppData\Roaming\npm;C:\Users\user\AppData\Local\Programs\Microsoft\WindowsApps"

echo Restoring user PATH...
reg add "HKCU\Environment" /v PATH /t REG_EXPAND_SZ /d "%SAFE_PATH%" /f

echo.
echo SAFE_PATH restored:
echo %SAFE_PATH%
echo.

echo Checking npm...
if exist "C:\Program Files\nodejs\npm.cmd" (
    echo Found npm at: C:\Program Files\nodejs\npm.cmd
    
    echo Checking if openclaw is installed...
    "C:\Program Files\nodejs\npm.cmd" list -g 2>nul
    if %errorlevel% equ 0 (
        "C:\Program Files\nodejs\npm.cmd" list -g ^| findstr "openclaw" >nul
        if %errorlevel% equ 0 (
            echo OpenClaw is already installed
        ) else (
            echo Installing OpenClaw...
            "C:\Program Files\nodejs\npm.cmd" install -g openclaw
        )
    ) else (
        echo ERROR: npm is not working correctly
    )
) else (
    echo ERROR: npm not found at C:\Program Files\nodejs\npm.cmd
)

echo.
echo ==========================================================
echo  DONE
echo ==========================================================
echo.
echo IMPORTANT:
echo 1. RESTART YOUR COMPUTER (for PATH to take effect)
echo 2. After restart, try: openclaw skills check
echo.

pause

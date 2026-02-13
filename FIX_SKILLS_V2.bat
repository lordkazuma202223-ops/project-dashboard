@echo off
echo ==========================================================
echo  OpenClaw Skills - Complete Fix Script
echo ==========================================================
echo.

REM Check installed binaries
echo Checking installed tools...
echo.

echo [1/6] Checking gh (GitHub CLI)...
if exist "C:\Program Files\GitHub CLI\gh.exe" (
    echo     FOUND: C:\Program Files\GitHub CLI\gh.exe
) else (
    echo     NOT FOUND
)

echo [2/6] Checking jq...
if exist "C:\ProgramData\chocolatey\bin\jq.exe" (
    echo     FOUND: C:\ProgramData\chocolatey\bin\jq.exe
) else (
    echo     NOT FOUND
)

echo [3/6] Checking ripgrep (rg)...
if exist "C:\ProgramData\chocolatey\bin\rg.exe" (
    echo     FOUND: C:\ProgramData\chocolatey\bin\rg.exe
) else (
    echo     NOT FOUND
)

echo [4/6] Checking ffmpeg...
if exist "C:\ProgramData\chocolatey\bin\ffmpeg.exe" (
    echo     FOUND: C:\ProgramData\chocolatey\bin\ffmpeg.exe
) else (
    echo     NOT FOUND
)

echo [5/6] Checking 1Password (op)...
if exist "C:\ProgramData\chocolatey\bin\op.exe" (
    echo     FOUND: C:\ProgramData\chocolatey\bin\op.exe
) else (
    echo     NOT FOUND
)

echo [6/6] Checking curl...
where curl >nul 2>nul
if %errorlevel% equ 0 (
    echo     FOUND (in PATH)
) else (
    echo     NOT FOUND - installing real curl binary...
    if not exist "C:\tools\" mkdir "C:\tools"
    echo Downloading curl...
    bitsadmin /transfer curldownload /download /priority normal https://curl.se/windows/dl-7.81.0_1/curl-7.81.0-win64-mingw.zip "C:\tools\curl.zip"
    echo Extracting...
    powershell -Command "Expand-Archive -Path 'C:\tools\curl.zip' -DestinationPath 'C:\tools' -Force"
    del "C:\tools\curl.zip"
)

echo.
echo ==========================================================
echo  Setting PATH environment variables...
echo ==========================================================
echo.

REM Get current PATH
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v PATH 2^>nul') do set "CURRENT_PATH=%%b"

REM Add paths if not already there
echo Current PATH:
echo %CURRENT_PATH%
echo.

REM Add to user PATH (persistent)
setx PATH "C:\Program Files\GitHub CLI;C:\ProgramData\chocolatey\bin;C:\tools;%PATH%"

echo.
echo ==========================================================
echo  DONE! 
echo ==========================================================
echo.
echo IMPORTANT STEPS:
echo.
echo 1. RESTART YOUR COMPUTER (or log out and log back in)
echo    This is required for PATH changes to take effect!
echo.
echo 2. After restart, run: openclaw skills check
echo.
echo ==========================================================

pause

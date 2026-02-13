@echo off
echo Fixing OpenClaw Skills - Adding tools to PATH...
echo.

REM Add paths to user PATH (persistent)
setx PATH "C:\Program Files\GitHub CLI;C:\ProgramData\chocolatey\bin;%PATH%"
echo PATH updated. New PATH:
echo %PATH%
echo.

REM Install real curl (Windows has PowerShell alias, not binary)
echo Installing curl...
if not exist "C:\tools\" mkdir "C:\tools"
powershell -Command "Invoke-WebRequest -Uri 'https://curl.se/windows/dl-7.81.0_1/curl-7.81.0-win64-mingw.zip' -OutFile 'C:\tools\curl.zip'"
powershell -Command "Expand-Archive -Path 'C:\tools\curl.zip' -DestinationPath 'C:\tools' -Force"
setx PATH "C:\tools;%PATH%"
echo curl installed to C:\tools
echo.

echo IMPORTANT: You MUST restart your computer or log out and log back in
echo for the new PATH environment variables to take effect.
echo.

echo After restarting, run: openclaw skills check
echo.

pause

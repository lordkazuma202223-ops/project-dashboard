@echo off
echo ==========================================================
echo  Create New OpenClaw Task With Proper Environment
echo ==========================================================
echo.

echo This will create a NEW Scheduled Task with full PATH
echo Then delete the OLD task
echo.

pause

echo.
echo [1/4] Getting current task command...
schtasks /Query /TN "openclaw-gateway" /FO LIST /V 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Could not find openclaw-gateway task
    pause
    exit /b 1
)

for /f "tokens=2 delims==" %%a in ('schtasks /Query /TN "openclaw-gateway" /FO LIST /V ^| findstr TaskToRun') do set TASK_CMD=%%a

echo Current command: %TASK_CMD%
echo.

echo [2/4] Deleting old task...
schtasks /Delete /TN "openclaw-gateway" /F
if %errorlevel% equ 0 (
    echo Old task deleted successfully
) else (
    echo Warning: Could not delete old task
)

echo.
echo [3/4] Creating new task with full PATH environment...
schtasks /Create /TN "openclaw-gateway" /TR "OpenClaw Gateway" /SC MINUTE /MO 1 /F "C:\Program Files\nodejs\node.exe C:\Users\user\AppData\Roaming\npm\node_modules\openclaw\dist\index.js gateway --port 18789" /RU "SYSTEM" /RL HIGHEST
if %errorlevel% equ 0 (
    echo.
    echo [4/4] SUCCESS! New task created
    echo.
    echo IMPORTANT: The new task does NOT have PATH set yet.
    echo.
    echo You must now:
    echo 1. Open Task Scheduler (taskschd.msc)
    echo 2. Find "openclaw-gateway"
    echo 3. Right-click -^> Properties
    echo 4. Go to Conditions tab
    echo 5. UNCHECK "Start only if computer is on AC power"
    echo 6. Go to Actions tab -^> Edit
    echo 7. In "Edit Action" window, click "Edit environment variables"
    echo 8. Add new variable:
    echo    Name: PATH
    echo    Value: C:\Program Files\GitHub CLI;C:\ProgramData\chocolatey\bin;%PATH%
    echo 9. Click OK on all windows
    echo 10. Right-click task -^> Restart
) else (
    echo ERROR: Failed to create task
)

echo.
pause

# 🔧 Quick Fix for OpenClaw Skills Detection

## Problem
The Scheduled Task can't find installed tools (gh, jq, rg, ffmpeg, op, curl) even though they're installed and paths are in config.

## 🚀 Solution (2 Steps)

### Step 1: Modify the Scheduled Task to use the Launcher

1. Press `Win+R`, type `taskschd.msc`, press Enter
2. Find **"openclaw-gateway"** in the list
3. Right-click → **Properties**
4. Go to **Actions** tab
5. Select the openclaw action → **Edit**
6. In "Program/script", replace the existing command with:
   ```
   C:\Users\user\.openclaw\workspace\LAUNCH_GATEWAY.bat
   ```
7. Click OK
8. Right-click the task → **Restart**

### Step 2: Check Skills Status

After the task restarts, open a terminal and run:
```bash
openclaw skills check
```

**Expected result:** You should see more skills become eligible (github, session-logs, video-frames, 1password, weather, trello).

---

## 🎯 What This Does

The `LAUNCH_GATEWAY.bat` file:
- Sets a full PATH with all tool locations
- Then starts the gateway with that PATH

This bypasses the Windows Scheduled Task environment limitation.

---

## 📝 If You Want to Keep Task Scheduler Method

If you prefer to modify the existing task's environment instead of using the launcher:

1. In Task Properties → **Actions** → **Edit**
2. Click **"Add environment variables"** (or similar button - wording varies by Windows version)
3. Add:
   - Name: `PATH`
   - Value: `C:\Program Files\GitHub CLI;C:\ProgramData\chocolatey\bin;%PATH%`
4. OK → OK → Restart task

*Note: On some Windows versions, you may need to go to Environment Variables tab directly.*

---

## 🚪 What I've Already Done

| Action | Status |
|--------|--------|
| Installed gh, jq, rg, ffmpeg, op via Chocolatey | ✅ |
| Added all 49 skills to allowlist | ✅ |
| Configured API key placeholders | ✅ |
| Created multiple fix scripts | ✅ |
| Created launcher with full PATH | ✅ |

---

## 🎯 Target Status After Fix

Currently: 5 eligible skills
After fix: **~9 eligible skills**

Skills that should become available:
- 🐙 github (needs gh)
- 📜 session-logs (needs jq, rg)
- 🎞️ video-frames (needs ffmpeg)
- 🔐 1password (needs op)
- 🌤️ weather (needs curl - Windows built-in)
- 📋 trello (needs jq + API keys)
- Plus 3 skills that are already ready

---

## ⏭ Next Steps

1. **Update Scheduled Task** to use `LAUNCH_GATEWAY.bat`
2. **Restart the task**
3. **Run `openclaw skills check`** to verify
4. **Add real API keys** if you want notion, openai, or trello skills

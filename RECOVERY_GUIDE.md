# 🚨 PATH CORRUPTED - Recovery Guide

## What Happened
The fix script corrupted your PATH environment variable. Now `openclaw` and `npm` commands don't work.

## 🚑 Solution: Restore Your PATH

### Step 1: Run Recovery Script
**Right-click and run as Administrator:**
```
C:\Users\user\.openclaw\workspace\RESET_PATH.bat
```

This will:
- ✅ Restore PATH to a safe working state
- ✅ Check if npm is accessible
- ✅ Check/reinstall OpenClaw if needed

### Step 2: RESTART YOUR COMPUTER
**This is mandatory** for PATH changes to take effect.

### Step 3: Test After Restart
Open a new terminal and run:
```bash
openclaw skills check
```

---

## 📝 Current PATH Backup

Your PATH was reset to this safe default:
```
C:\Python310\
C:\Windows\system32
C:\Windows
C:\Windows\System32\Wbem
C:\Windows\System32\WindowsPowerShell\v1.0\
C:\Windows\System32\OpenSSH\
C:\Program Files\dotnet\
C:\Program Files\Java\jdk1.8.0_301\bin
C:\Program Files\Git\cmd
C:\Users\user\AppData\Local\Programs\Ollama
C:\Users\user\AppData\Roaming\npm
C:\Users\user\AppData\Local\Programs\Microsoft\WindowsApps
```

---

## What Was Lost (Will Re-Add After Fix)

After PATH is restored, we'll need to re-add:
- C:\Program Files\GitHub CLI (for github skill)
- C:\ProgramData\chocolatey\bin (for jq, rg, ffmpeg, op)

---

## Alternative: Manual PATH Fix (If Script Fails)

1. Press `Win+R`
2. Type: `sysdm.cpl`
3. Go to **Advanced** tab
4. Click **Environment Variables**
5. Under **User variables**, find `PATH`
6. Click **Edit**
7. Delete the corrupted value
8. Paste this safe default:
```
C:\Python310\;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;C:\Program Files\dotnet\;C:\Program Files\Java\jdk1.8.0_301\bin;C:\Program Files\Git\cmd;C:\Users\user\AppData\Local\Programs\Ollama;C:\Users\user\AppData\Roaming\npm;C:\Users\user\AppData\Local\Programs\Microsoft\WindowsApps
```
9. Click OK on all dialogs
10. RESTART COMPUTER

---

## After Everything Is Fixed

Once `openclaw` works again, we can:
1. Re-add tool paths to config
2. Check skills status
3. You should have ~9 eligible skills

---

**Run the RESET_PATH.bat script first, then restart!** 💪

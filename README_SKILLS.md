# How to Fix OpenClaw Skills Detection

## Problem
The gateway service can't detect installed binaries (gh, jq, rg, ffmpeg, op, curl) even though they're installed.

## Solution

### Step 1: Run the Fix Script
Double-click and run this file:
```
C:\Users\user\.openclaw\workspace\FIX_SKILLS_V2.bat
```

This will:
1. Check which tools are installed
2. Download real curl binary (Windows has a fake curl alias)
3. Add all tool paths to your user PATH environment variable

### Step 2: RESTART YOUR COMPUTER
**This is critical!** The PATH changes won't take effect until you restart.

### Step 3: Check Skills Status
After restarting, open a terminal and run:
```bash
openclaw skills check
```

You should see more skills become eligible:
- ✅ github (needs gh)
- ✅ session-logs (needs jq, rg)
- ✅ video-frames (needs ffmpeg)
- ✅ 1password (needs op)
- ✅ weather (needs curl)

## What's Already Configured

✅ All 49 skills are in allowlist
✅ API key placeholders are set for:
   - notion
   - openai-image-gen
   - openai-whisper-api
✅ voice-call plugin is enabled
✅ Gateway exec PATH is configured

## Manual Setup Required

These tools need to be downloaded from GitHub releases:
- clawhub, wacli, bird, blucli, camsnap, eightctl, gemini
- gifgrep, gog, goplaces, himalaya, local-places
- mcporter, nano-banana-pro, nano-pdf, openhue, oracle
- ordercli, sag, songsee, sonoscli, spotify-player, summarize, blogwatcher

For these, download the Windows binary from their GitHub releases and place in a folder in your PATH (like `C:\tools`).

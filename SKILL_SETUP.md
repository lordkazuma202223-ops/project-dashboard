# Skill Setup Progress

## ✅ Already Installed
- gh (GitHub CLI)
- jq (JSON processor)
- rg (ripgrep)
- ffmpeg (video/audio)
- op (1Password CLI)
- npm (Node.js)
- python

## 🔧 Tools to Install Manually (Download from GitHub)

### Go/Rust Binaries
These need to be downloaded from GitHub releases:
1. **clawhub** - https://github.com/openclaw/clawhub/releases
2. **wacli** - https://github.com/openclaw/wacli/releases
3. **bird** - https://github.com/vitaly-t/feed-parser-tool/releases
4. **blucli** - BlueBubbles CLI
5. **camsnap** - Camera snapshot tool
6. **eightctl** - Eight sleep tracker
7. **gemini** - Google Gemini CLI
8. **gifgrep** - GIF search
9. **gog** - GOG.com CLI
10. **goplaces** - Google Places CLI
11. **himalaya** - Email CLI
12. **local-places** - Local places database
13. **mcporter** - Minecraft exporter
14. **nano-banana-pro** - Tool
15. **nano-pdf** - PDF processing
16. **openhue** - Philips Hue CLI
17. **oracle** - Oracle CLI
18. **ordercli** - Food ordering
19. **sag** - ElevenLabs TTS
20. **songsee** - Song recognition
21. **sonoscli** - Sonos controller
22. **spotify_player** - Spotify player
23. **summarize** - Text summarization
24. **blogwatcher** - Blog RSS watcher

### Python Tools
- **obsidian-cli** - Install via: `pip install obsidian-cli`
- **whisper** - Install via: `pip install openai-whisper`

## 🔑 Skills That Only Need API Keys

These are ready to configure:

### Notion
```bash
# Set environment variable or add to config
NOTION_API_KEY=your_token_here
```

### OpenAI (for image gen & whisper)
```bash
OPENAI_API_KEY=sk-your-key-here
```

### Google Places / Goplaces / Local-places
```bash
GOOGLE_PLACES_API_KEY=your-google-api-key
```

### Trello
```bash
TRELLO_API_KEY=your-api-key
TRELLO_TOKEN=your-token
```

### ElevenLabs (for sag TTS)
```bash
ELEVENLABS_API_KEY=your-elevenlabs-key
```

### Gemini / nano-banana-pro
```bash
GEMINI_API_KEY=your-gemini-key
```

## ⚠️ Skills Requiring Special Setup

### sherpa-onnx-tts
Needs model directories:
```bash
SHERPA_ONNX_RUNTIME_DIR=path/to/runtime
SHERPA_ONNX_MODEL_DIR=path/to/models
```

### coding-agent
Needs one of: claude, codex, opencode, or pi (these are AI coding assistants, not CLI tools)

### voice-call
Needs to enable plugin and configure provider (Telnyx, Twilio, Plivo)

## 📋 Next Steps

1. **For CLI tools:** Download releases from GitHub and extract to a folder in your PATH
2. **For API keys:** Add to your environment variables or OpenClaw config
3. **For complex tools:** Follow their specific setup guides

Want me to help configure any specific skills with API keys?

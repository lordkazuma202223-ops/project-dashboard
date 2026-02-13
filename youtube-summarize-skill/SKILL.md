---
name: youtube-summarize
description: Summarize YouTube videos using transcript extraction and AI
emoji: 🎥
---

# YouTube Summarize

Summarize YouTube videos by extracting transcripts and using AI to summarize.

## Prerequisites

- **OPENAI_API_KEY** or **ANTHROPIC_API_KEY** for summarization
- Optional: **APIFY_API_TOKEN** for better transcript extraction

## Usage

```bash
# Summarize a YouTube video
youtube-summarize "https://youtube.com/watch?v=VIDEO_ID"

# Specify summary length
youtube-summarize "https://youtube.com/watch?v=VIDEO_ID" --length short

# Use specific AI model
youtube-summarize "https://youtube.com/watch?v=VIDEO_ID" --model openai/gpt-4o
```

## Implementation

This skill uses:
1. Transcript extraction (via Apify YouTube Transcript Scraper or manual method)
2. AI summarization (OpenAI or Anthropic API)

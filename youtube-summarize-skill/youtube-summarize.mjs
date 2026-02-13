#!/usr/bin/env node

import fs from 'fs';

async function main() {
  const url = process.argv[2];
  const length = process.argv.find(arg => arg.startsWith('--length'))?.split('=')[1] || 'medium';
  const model = process.argv.find(arg => arg.startsWith('--model'))?.split('=')[1] || 'gpt-4o-mini';

  if (!url) {
    console.error('Usage: youtube-summarize <url> [--length short|medium|long] [--model <model>]');
    process.exit(1);
  }

  // Extract video ID
  const videoId = extractVideoId(url);
  if (!videoId) {
    console.error('❌ Invalid YouTube URL');
    process.exit(1);
  }

  console.log(`🎥 Video ID: ${videoId}`);
  console.log(`📝 Model: ${model}, Length: ${length}`);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not set');
    console.error('   Set it with: setx OPENAI_API_KEY "your-key-here"');
    process.exit(1);
  }

  try {
    // For now, we'll use OpenAI with the video URL as context
    // In a full implementation, you'd want to:
    // 1. Extract transcript using a service like Apify
    // 2. Send the transcript to AI for summarization

    const prompt = `Please analyze and summarize this YouTube video: ${url}

Provide a ${length} summary including:
- Main topic/key points
- Key insights or takeaways
- Any important details mentioned

Keep it clear and concise.`;

    console.log(`\n⏳ Summarizing using ${model}...`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: length === 'short' ? 500 : length === 'medium' ? 1000 : 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY');
    console.log('='.repeat(50));
    console.log(summary);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Note: This is a basic implementation using the video URL.');
    console.error('   For full transcript-based summarization, consider using:');
    console.error('   - Apify YouTube Transcript Scraper (requires APIFY_API_TOKEN)');
    console.error('   - youtube-transcript-api (Python)');
    process.exit(1);
  }
}

function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

main().catch(console.error);

#!/usr/bin/env node

/**
 * Start ngrok tunnel for OpenClaw Gateway
 * Exposes localhost:18789 to the internet
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting ngrok tunnel for OpenClaw Gateway...');
console.log('   Local: http://localhost:18789');
console.log('   Port: 18789');
console.log('');

const ngrok = spawn('ngrok', ['http', '18789'], {
  stdio: 'inherit',
  shell: true
});

ngrok.on('close', (code) => {
  console.log(`\nngrok process exited with code ${code}`);
  console.log('Tunnel stopped. To restart: node start-ngrok-v1.js');
});

ngrok.on('error', (err) => {
  console.error('Failed to start ngrok:', err);
  console.log('Make sure ngrok is installed: npm install -g ngrok');
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nStopping ngrok tunnel...');
  ngrok.kill();
  process.exit(0);
});

const { chromium } = require('playwright-core');

async function runKlingAI(prompt) {
  // Connect to existing Chrome instance via CDP
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');

  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  // Navigate directly to the video generation page
  console.log('Navigating to Kling AI video generation page...');
  await page.goto('https://app.klingai.com/global/video/new', { waitUntil: 'domcontentloaded' });
  console.log('✓ Navigated to video generation page');

  // Wait for page to fully load
  console.log('Waiting for page to fully load...');
  await page.waitForTimeout(5000);

  // Take screenshot to see current state
  await page.screenshot({ path: 'kling-video-page.png', fullPage: true });
  console.log('✓ Screenshot saved: kling-video-page.png');

  // Find and fill prompt input field
  console.log('Looking for prompt input field...');

  const inputFilled = await page.evaluate((text) => {
    // Try contenteditable first
    const inputs = Array.from(document.querySelectorAll('[contenteditable="true"]'));
    for (const input of inputs) {
      const rect = input.getBoundingClientRect();
      if (rect.width > 100 && rect.height > 30) {
        input.focus();
        input.textContent = text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { success: true, text: input.textContent };
      }
    }
    return { success: false };
  }, prompt);

  if (inputFilled.success) {
    console.log(`✓ Prompt entered: ${prompt}`);
    await page.waitForTimeout(2000);

    // Take screenshot after entering prompt
    await page.screenshot({ path: 'kling-after-prompt.png', fullPage: true });
    console.log('✓ Screenshot saved: kling-after-prompt.png');

    // Click generate button
    console.log('Clicking generate button...');
    const buttonClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      for (const button of buttons) {
        const text = button.textContent.toLowerCase();
        if (text.includes('generate') || text.includes('create') || text.includes('start')) {
          const rect = button.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            button.click();
            return {
              success: true,
              text: button.textContent.trim()
            };
          }
        }
      }
      return { success: false };
    });

    if (buttonClicked.success) {
      console.log(`✓ Clicked button: "${buttonClicked.text}"`);
      console.log('✓ Generation started...');

      // Monitor generation progress
      console.log('\nMonitoring generation progress...');
      console.log('Press Ctrl+C to stop monitoring early\n');

      let lastProgress = '';
      let completed = false;
      let attempts = 0;
      const maxAttempts = 180; // Max 30 minutes (180 * 10 seconds)

      while (!completed && attempts < maxAttempts) {
        attempts++;

        const status = await page.evaluate(() => {
          // Look for completion indicators
          const pageText = document.body.textContent.toLowerCase();

          // Check for success indicators
          const hasDownloadButton = Array.from(document.querySelectorAll('button, a'))
            .some(btn => btn.textContent.toLowerCase().includes('download'));

          const hasVideoPlayer = document.querySelector('video') !== null;
          const hasCompletedText = pageText.includes('completed') ||
                               pageText.includes('success') ||
                               pageText.includes('done') ||
                               pageText.includes('ready');

          // Check for progress indicators
          const progressElements = Array.from(document.querySelectorAll('[class*="progress"], [class*="status"], [class*="time"]'))
            .map(el => el.textContent.trim())
            .filter(t => t.length > 0);

          return {
            hasDownloadButton,
            hasVideoPlayer,
            hasCompletedText,
            progressText: progressElements.join(' | ')
          };
        });

        // Check if generation is complete
        if (status.hasDownloadButton || status.hasVideoPlayer || status.hasCompletedText) {
          console.log('\n✓ Generation completed!');
          completed = true;
          break;
        }

        // Display progress updates
        if (status.progressText && status.progressText !== lastProgress) {
          lastProgress = status.progressText;
          console.log(`[${new Date().toLocaleTimeString()}] Progress: ${status.progressText}`);
        }

        // Take periodic screenshots (every 2 minutes)
        if (attempts % 12 === 0) {
          await page.screenshot({ path: `kling-progress-${attempts}.png` });
          console.log(`📸 Screenshot saved: kling-progress-${attempts}.png`);
        }

        // Wait 10 seconds before next check
        await page.waitForTimeout(10000);
      }

      if (completed) {
        // Take final screenshot
        await page.screenshot({ path: 'kling-result.png', fullPage: true });
        console.log('✓ Screenshot saved: kling-result.png');

        // Try to click download button
        console.log('\nLooking for download button...');
        const downloadClicked = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, a'));
          for (const button of buttons) {
            if (button.textContent.toLowerCase().includes('download')) {
              const rect = button.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                button.click();
                return { success: true };
              }
            }
          }
          return { success: false };
        });

        if (downloadClicked.success) {
          console.log('✓ Clicked download button');
          await page.waitForTimeout(5000); // Wait for download to start
        }
      } else {
        console.log(`\n⏱️ Time limit reached (${maxAttempts * 10} seconds)`);
        console.log('Generation is still in progress. Check the screenshots.');
        await page.screenshot({ path: 'kling-timeout.png', fullPage: true });
      }
    }
  } else {
    console.log('❌ Could not find input field');
  }

  await browser.close();
  console.log('\n✅ Done!');
}

// Run with provided prompt
const prompt = process.argv[2] || 'A beautiful sunset over ocean with golden light';
console.log(`Prompt: ${prompt}\n`);
runKlingAI(prompt).catch(console.error);

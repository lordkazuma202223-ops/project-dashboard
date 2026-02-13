const { chromium } = require('playwright-core');

async function runKlingAI(prompt) {
  // Connect to the existing Chrome instance via CDP
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');

  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  // Navigate directly to the video generation page (user is already logged in)
  console.log('Navigating to Kling AI video generation page...');
  await page.goto('https://app.klingai.com/global/video/new', { waitUntil: 'domcontentloaded' });
  console.log('✓ Navigated to video generation page');

  // Wait longer for dynamic content to load
  console.log('Waiting for page to fully load...');
  await page.waitForTimeout(5000);

  // Take screenshot to see current state
  await page.screenshot({ path: 'kling-video-page.png', fullPage: true });
  console.log('✓ Screenshot saved: kling-video-page.png');

  // Debug: Get all input/textarea elements
  console.log('Debug: Scanning page for input elements...');
  const debugInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('textarea, input, [contenteditable="true"]'));
    return inputs.map((input, index) => {
      const rect = input.getBoundingClientRect();
      return {
        index,
        tag: input.tagName,
        type: input.getAttribute('type') || '',
        placeholder: input.getAttribute('placeholder') || '',
        className: input.className,
        id: input.id,
        contentEditable: input.getAttribute('contenteditable'),
        visible: rect.width > 0 && rect.height > 0,
        width: rect.width,
        height: rect.height,
        value: input.value || ''
      };
    });
  });

  console.log('Found input elements:', JSON.stringify(debugInfo, null, 2));

  // Use JavaScript to find and fill the prompt input field
  console.log('\nLooking for prompt input field...');

  const inputFilled = await page.evaluate((text) => {
    // Try multiple selector strategies
    const strategies = [
      // Strategy 1: By contenteditable
      () => {
        const inputs = Array.from(document.querySelectorAll('[contenteditable="true"]'));
        for (const input of inputs) {
          const rect = input.getBoundingClientRect();
          if (rect.width > 100 && rect.height > 30) {
            input.focus();
            input.textContent = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            return { success: true, method: 'contenteditable', text: input.textContent };
          }
        }
        return null;
      },
      // Strategy 2: By textarea
      () => {
        const inputs = Array.from(document.querySelectorAll('textarea'));
        for (const input of inputs) {
          const rect = input.getBoundingClientRect();
          if (rect.width > 100 && rect.height > 30) {
            input.focus();
            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            return { success: true, method: 'textarea', value: input.value };
          }
        }
        return null;
      },
      // Strategy 3: By input type text
      () => {
        const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
        for (const input of inputs) {
          const rect = input.getBoundingClientRect();
          if (rect.width > 100 && rect.height > 30) {
            input.focus();
            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            return { success: true, method: 'input', value: input.value };
          }
        }
        return null;
      },
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result) return result;
    }
    return { success: false };
  }, prompt);

  if (inputFilled.success) {
    console.log(`✓ Prompt entered using ${inputFilled.method}: ${prompt}`);
    console.log(`  Result text: "${inputFilled.text || inputFilled.value}"`);

    await page.waitForTimeout(2000);

    // Take screenshot after entering prompt
    await page.screenshot({ path: 'kling-after-prompt.png', fullPage: true });
    console.log('✓ Screenshot saved: kling-after-prompt.png');

    // Use JavaScript to find and click generate button
    console.log('\nLooking for generate button...');

    const buttonInfo = await page.evaluate(() => {
      // Find all buttons
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      const buttonData = buttons.map((btn, index) => {
        const rect = btn.getBoundingClientRect();
        return {
          index,
          tag: btn.tagName,
          text: btn.textContent.trim(),
          className: btn.className,
          id: btn.id,
          visible: rect.width > 0 && rect.height > 0,
          role: btn.getAttribute('role')
        };
      });

      // Filter for visible buttons with relevant text
      const relevantButtons = buttonData.filter(b =>
        b.visible && (
          b.text.toLowerCase().includes('generate') ||
          b.text.toLowerCase().includes('create') ||
          b.text.toLowerCase().includes('start') ||
          b.text.toLowerCase().includes('submit')
        )
      );

      return {
        allButtons: buttonData,
        relevantButtons: relevantButtons
      };
    });

    console.log('Found relevant buttons:', JSON.stringify(buttonInfo.relevantButtons, null, 2));

    const buttonClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      for (const button of buttons) {
        const text = button.textContent.toLowerCase();
        if (text.includes('generate') || text.includes('create') || text.includes('start') || text.includes('submit')) {
          const rect = button.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            button.click();
            return {
              success: true,
              text: button.textContent.trim(),
              className: button.className
            };
          }
        }
      }
      return { success: false };
    });

    if (buttonClicked.success) {
      console.log(`✓ Clicked button: "${buttonClicked.text}"`);
      console.log('✓ Generation started...');

      // Wait for generation to complete (this can take 2-5 minutes)
      console.log('Waiting for video to generate (this may take 2-5 minutes)...');
      await page.waitForTimeout(180000); // Wait 3 minutes

      // Take final screenshot
      await page.screenshot({ path: 'kling-result.png', fullPage: true });
      console.log('✓ Screenshot saved: kling-result.png');
    } else {
      console.log('❌ Could not click generate button');
      await page.screenshot({ path: 'kling-no-button.png', fullPage: true });
    }
  } else {
    console.log('❌ Could not find or fill input field');
    await page.screenshot({ path: 'kling-no-input.png', fullPage: true });
  }

  await browser.close();
  console.log('✅ Done! Check the screenshots in the workspace directory.');
}

// Run with provided prompt
const prompt = process.argv[2] || 'A beautiful sunset over the ocean with golden light';
console.log(`Prompt: ${prompt}\n`);
runKlingAI(prompt).catch(console.error);

const { chromium } = require('playwright');
const { exec } = require('child_process');

async function sendRateToTelegram(rate, mmkValue) {
  // Send message using OpenClaw Gateway API
  const message = `WU Rate Update: 1 SGD = ${mmkValue} MMK`;
  console.log('Sending to Telegram:', message);

  try {
    // Use curl to call OpenClaw Gateway message API
    const exec = require('child_process').exec;
    const target = '5928617089';
    const encodedMessage = encodeURIComponent(message);

    // Get gateway token from environment or use default
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';

    return new Promise((resolve, reject) => {
      exec(`curl -s -X POST "${gatewayUrl}/api/message/send" -H "Content-Type: application/json" -d '{"channel":"telegram","target":"${target}","message":"${encodedMessage}"}'`, (error, stdout, stderr) => {
        if (error) {
          console.error('Failed to send message:', error);
          reject(error);
        } else {
          console.log('✓ Rate sent to Telegram:', message);
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

async function getWUCurrentRate() {
  // Launch a new browser instance instead of connecting to CDP
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Retrieving WU MMK → SGD rate...');

  try {
    await page.goto('https://www.westernunion.com/sg/en/currency-converter/sgd-to-mmk-rate.html', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for JavaScript to load the rate
    await page.waitForTimeout(5000);

    // Try multiple methods to find the rate
    let mmkValue = null;

    // Method 1: Look for rate in text content
    try {
      const rateText = await page.evaluate(() => {
        // Try to find elements containing rate information
        const possibleSelectors = [
          '[data-testid*="rate"]',
          '[class*="rate"]',
          '[class*="exchange"]',
          '[class*="conversion"]'
        ];

        for (const selector of possibleSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const text = el.textContent;
            const match = text.match(/(\d+\.?\d*)\s*MMK/i);
            if (match && match[1]) {
              return match[1];
            }
          }
        }

        // Fallback: search entire document
        const fullText = document.body.textContent;
        const match = fullText.match(/(\d+\.?\d*)\s*MMK/i);
        if (match) {
          return match[1];
        }

        return null;
      });

      if (rateText) {
        mmkValue = rateText;
      }
    } catch (e) {
      console.log('Method 1 failed:', e.message);
    }

    // Method 2: Take screenshot for manual inspection
    if (!mmkValue) {
      console.log('❌ Could not retrieve rate from text');
      console.log('Page URL:', page.url());

      // Take a screenshot for debugging
      await page.screenshot({
        path: 'wu-rate-screenshot.png',
        fullPage: true
      });
      console.log('Screenshot saved to wu-rate-screenshot.png');
    }

    await browser.close();

    if (mmkValue) {
      console.log(`✓ Rate found: 1 SGD = ${mmkValue} MMK`);

      // Send to Telegram
      await sendRateToTelegram('SGD', mmkValue);

      return mmkValue;
    } else {
      console.log('❌ Could not retrieve rate');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving rate:', error);
    await browser.close();
    return null;
  }
}

// Run and output result
getWUCurrentRate().then(mmkValue => {
  if (mmkValue) {
    console.log(`\n✅ Daily rate retrieved: ${mmkValue} MMK per 1 SGD`);
    console.log(`Rate: ${mmkValue} MMK`);
    process.exit(0);
  } else {
    console.log('\n❌ Failed to retrieve rate');
    process.exit(1);
  }
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});

const { chromium } = require('playwright-core');
const { exec } = require('child_process');

async function sendRateToTelegram(rate, mmkValue) {
  // Send message using Telegram
  const message = `WU Rate Update: 1 SGD = ${mmkValue} MMK`;
  console.log('Sending to Telegram:', message);

  exec(`telegram-cli send -m "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error sending to Telegram:', error);
      return;
    }
    console.log('✓ Sent to Telegram');
  });
}

async function getWUCurrentRate() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  console.log('Retrieving WU MMK → SGD rate...');

  try {
    await page.goto('https://www.westernunion.com/sg/en/currency-converter/sgd-to-mmk-rate.html', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    // Retrieve MMK value from the displayed rate
    const rateData = await page.evaluate(() => {
      const pageText = document.body.textContent;

      // Pattern to find MMK value
      const match = pageText.match(/(\d+\.?\d*)\s*MMK/i);

      if (match) {
        return {
          mmkValue: match[1],
          fullRate: pageText.substring(0, 100)
        };
      }

      return { mmkValue: null };
    });

    await browser.close();

    if (rateData.mmkValue) {
      console.log(`✓ Rate found: 1 SGD = ${rateData.mmkValue} MMK`);

      // Send to Telegram
      await sendRateToTelegram('SGD', rateData.mmkValue);

      return rateData.mmkValue;
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
  }
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});

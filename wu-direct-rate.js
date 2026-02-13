const { chromium } = require('playwright-core');

async function getSGDMMKRate() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  console.log('Navigating to SGD to MMK rate page...');
  await page.goto('https://www.westernunion.com/sg/en/currency-converter/sgd-to-mmk-rate.html', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  console.log('✓ Loaded SGD to MMK rate page');

  await page.waitForTimeout(5000);

  // Take screenshot
  await page.screenshot({ path: 'wu-sgd-mmk-direct.png', fullPage: true });
  console.log('✓ Screenshot: wu-sgd-mmk-direct.png');

  // Look for rate information
  console.log('\nLooking for rate information...');
  const rateInfo = await page.evaluate(() => {
    const pageText = document.body.textContent;

    // Look for rate patterns
    const patterns = [
      /(\d+\.?\d*)\s*SGD\s*[=|→]\s*(\d+\.?\d*)\s*MMK/i,
      /(\d+\.?\d*)\s*MMK\s*[=|→]\s*(\d+\.?\d*)\s*SGD/i,
      /SGD\s*[=|→]\s*([1-9]\d*(?:\.\d+)?)\s*MMK/i,
      /MMK\s*[=|→]\s*([1-9]\d*(?:\.\d+)?)\s*SGD/i,
    ];

    for (const pattern of patterns) {
      const match = pageText.match(pattern);
      if (match) {
        return {
          found: true,
          rate: match[0],
          from: match[1],
          to: match[2],
          pattern: pattern.toString()
        };
      }
    }

    // Look for any numbers with currency codes
    const currencyPatterns = [
      /(\d+\.?\d*)\s*SGD.*?(\d+\.?\d*)\s*MMK/i,
      /(\d+\.?\d*)\s*MMK.*?(\d+\.?\d*)\s*SGD/i,
    ];

    for (const pattern of currencyPatterns) {
      const match = pageText.match(pattern);
      if (match) {
        return {
          found: true,
          rate: match[0],
          fromCurrency: 'SGD',
          toCurrency: 'MMK',
          fromAmount: match[1],
          toAmount: match[2],
          pattern: pattern.toString()
        };
      }
    }

    // Return page snippet for debugging
    return {
      found: false,
      pageText: pageText.substring(0, 500)
    };
  });

  console.log('Rate info:', JSON.stringify(rateInfo, null, 2));

  await browser.close();
  console.log('\n✅ Done!');
}

getSGDMMKRate().catch(console.error);

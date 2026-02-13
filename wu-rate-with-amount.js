const { chromium } = require('playwright-core');

async function getMMKSGDRateWithAmount() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  console.log('Navigating to WU currency converter...');
  await page.goto('https://www.westernunion.com/sg/en/currency-converter.html', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  console.log('✓ Loaded currency converter');

  await page.waitForTimeout(3000);

  // Click "Accept all" if present
  try {
    const acceptButton = page.getByText(/accept all/i);
    const count = await acceptButton.count();
    if (count > 0) {
      await acceptButton.first().click();
      await page.waitForTimeout(2000);
      console.log('✓ Clicked "Accept all"');
    }
  } catch (e) {}

  // Enter amount in MMK
  console.log('\nEntering amount 10,000 MMK...');
  const amountEntered = await page.evaluate(() => {
    // Look for amount input
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]'))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

    for (const input of inputs) {
      const placeholder = (input.placeholder || '').toLowerCase();
      const id = (input.id || '').toLowerCase();
      const name = (input.name || '').toLowerCase();

      // Find the amount input (send or receive)
      if (placeholder.includes('amount') ||
          placeholder.includes('send') ||
          placeholder.includes('receive') ||
          id.includes('amount') ||
          name.includes('amount')) {
        input.focus();
        input.value = '';
        input.value = '10000';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return { entered: true, placeholder, id, name };
      }
    }
    return { entered: false };
  });

  console.log('Amount entry result:', JSON.stringify(amountEntered, null, 2));

  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'wu-with-amount.png', fullPage: true });
  console.log('✓ Screenshot: wu-with-amount.png');

  // Capture the rate
  await page.waitForTimeout(2000);

  console.log('\nCapturing exchange rate...');
  const rateInfo = await page.evaluate(() => {
    const pageText = document.body.textContent;

    // Look for rate with specific patterns
    const patterns = [
      /10,000\s*MMK\s*[^\d]*?\s*=\s*([1-9]\d*(?:\.\d+)?)\s*SGD/i,
      /MMK\s*10,000\s*[^\d]*?\s*=\s*([1-9]\d*(?:\.\d+)?)\s*SGD/i,
      /(\d+\.?\d*)\s*SGD\s*[^\d]*?\s*for\s*10,000\s*MMK/i,
      /10,000\s*MMK\s*[^\d]*?\s*[→|to]+\s*[^\d]*?\s*([1-9]\d*(?:\.\d+)?)\s*SGD/i,
    ];

    for (const pattern of patterns) {
      const match = pageText.match(pattern);
      if (match) {
        return {
          found: true,
          pattern: pattern.toString(),
          rate: match[1],
          fullMatch: match[0]
        };
      }
    }

    // Look for any rate pattern with MMK and SGD
    const anyMMKSGD = /MMK[^\d]*?SGD[^\d]*?(\d+\.?\d*)|SGD[^\d]*?MMK[^\d]*?(\d+\.?\d*)/i.exec(pageText);

    return {
      found: false,
      anyMMKSGD: anyMMKSGD ? anyMMKSGD[1] : null,
      snippet: pageText.substring(0, 400)
    };
  });

  console.log('Rate info:', JSON.stringify(rateInfo, null, 2));

  await page.screenshot({ path: 'wu-final-with-rate.png', fullPage: true });
  console.log('✓ Screenshot: wu-final-with-rate.png');

  await browser.close();
  console.log('\n✅ Done!');
}

getMMKSGDRateWithAmount().catch(console.error);

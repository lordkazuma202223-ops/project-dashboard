const { chromium } = require('playwright-core');

async function getMMKFor1SGD() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  console.log('Navigating to SGD to MMK rate page...');
  await page.goto('https://www.westernunion.com/sg/en/currency-converter/sgd-to-mmk-rate.html', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  console.log('✓ Loaded page');

  await page.waitForTimeout(3000);

  // Take initial screenshot
  await page.screenshot({ path: 'wu-before-input.png', fullPage: true });
  console.log('✓ Screenshot: wu-before-input.png');

  // Enter "1" in the SGD field
  console.log('\nEntering "1" in SGD field...');
  const enterResult = await page.evaluate(() => {
    // Look for the first input field (SGD field)
    const inputs = Array.from(document.querySelectorAll('input[type="number"], input[type="text"]'))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

    if (inputs.length > 0) {
      const sgdInput = inputs[0];
      sgdInput.focus();
      sgdInput.value = '';
      sgdInput.value = '1';
      sgdInput.dispatchEvent(new Event('input', { bubbles: true }));
      sgdInput.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        entered: true,
        placeholder: sgdInput.placeholder || '',
        value: sgdInput.value
      };
    }
    return { entered: false };
  });

  console.log('Enter result:', JSON.stringify(enterResult, null, 2));

  await page.waitForTimeout(3000);

  // Take screenshot after entering value
  await page.screenshot({ path: 'wu-after-input.png', fullPage: true });
  console.log('✓ Screenshot: wu-after-input.png');

  // Retrieve the MMK value
  console.log('\nRetrieving MMK value...');
  const mmkValue = await page.evaluate(() => {
    const pageText = document.body.textContent;

    // Look for MMK value patterns
    const patterns = [
      /(\d+\.?\d*)\s*MMK/i,
      /MMK\s*[=:]?\s*(\d+\.?\d*)/i,
    ];

    for (const pattern of patterns) {
      const match = pageText.match(pattern);
      if (match) {
        return {
          found: true,
          mmkValue: match[1],
          fullText: match[0],
          pattern: pattern.toString()
        };
      }
    }

    // Look for any number near MMK text
    const mmkIndex = pageText.indexOf('MMK');
    if (mmkIndex > -1) {
      const contextStart = Math.max(0, mmkIndex - 20);
      const contextEnd = Math.min(pageText.length, mmkIndex + 50);
      const context = pageText.substring(contextStart, contextEnd);

      // Try to extract number from context
      const numberMatch = context.match(/(\d+\.?\d*)/);
      if (numberMatch) {
        return {
          found: true,
          mmkValue: numberMatch[1],
          context: context
        };
      }
    }

    return {
      found: false,
      snippet: pageText.substring(0, 400)
    };
  });

  console.log('MMK value result:', JSON.stringify(mmkValue, null, 2));

  // Final screenshot
  await page.screenshot({ path: 'wu-final-mmk-value.png', fullPage: true });
  console.log('✓ Screenshot: wu-final-mmk-value.png');

  await browser.close();

  if (mmkValue.found) {
    console.log('\n✅ Rate retrieved:');
    console.log(`1 SGD = ${mmkValue.mmkValue} MMK`);
    console.log(`1 MMK = ${1 / mmkValue.mmkValue} SGD`);
  } else {
    console.log('\n❌ Could not find MMK value');
  }
}

getMMKFor1SGD().catch(console.error);

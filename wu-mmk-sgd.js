const { chromium } = require('playwright-core');

async function getMMKSGDRate() {
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
  const acceptClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button')).filter(btn =>
      btn.textContent.toLowerCase().includes('accept all')
    );
    if (buttons.length > 0) {
      buttons[0].click();
      return true;
    }
    return false;
  });

  if (acceptClicked) {
    await page.waitForTimeout(2000);
    console.log('✓ Clicked "Accept all"');
  }

  // Click "From" dropdown (Singapore currently selected)
  console.log('\nClicking "From" dropdown...');
  const fromClicked = await page.evaluate(() => {
    const fromDropdown = document.querySelector('[class*="senderCurrencyDrop"]');
    if (fromDropdown) {
      fromDropdown.click();
      return { clicked: true };
    }
    return { clicked: false };
  });

  if (fromClicked.clicked) {
    await page.waitForTimeout(2000);
    console.log('✓ Clicked "From" dropdown');

    // Type "MMK" to search for Myanmar
    console.log('Typing "MMK" to search...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'))
        .filter(el => el.getBoundingClientRect().width > 0);
      for (const input of inputs) {
        input.focus();
        input.value = '';
        input.value = 'MMK';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { typed: true };
      }
      return { typed: false };
    });

    await page.waitForTimeout(2000);
    console.log('✓ Typed "MMK"');

    // Look for and click Myanmar/MMK option
    console.log('Looking for Myanmar (MMK) option...');
    const mmkClicked = await page.evaluate(() => {
      const allText = document.body.textContent;
      const allItems = Array.from(document.querySelectorAll('li, [role="option"], div[class*="item"]'))
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map(el => ({
          text: el.textContent.trim(),
          visible: true
        }));

      // Find item containing MMK or Myanmar
      for (const item of allItems) {
        if (item.text.includes('MMK') ||
            item.text.includes('Myanmar') ||
            item.text.includes('mmk')) {
          item.click();
          return { clicked: true, text: item.text };
        }
      }
      return { clicked: false, items: allItems.slice(0, 10) };
    });

    console.log('MMK click result:', JSON.stringify(mmkClicked, null, 2));

    if (mmkClicked.clicked) {
      await page.waitForTimeout(2000);
      console.log(`✓ Selected: ${mmkClicked.text}`);
    }

    await page.screenshot({ path: 'wu-selected-mmk.png', fullPage: true });
    console.log('✓ Screenshot: wu-selected-mmk.png');
  }

  // Click "To" dropdown to select Singapore
  console.log('\nClicking "To" dropdown...');
  const toClicked = await page.evaluate(() => {
    const toDropdown = document.querySelector('[class*="receiverCurrencyDrop"]');
    if (toDropdown) {
      toDropdown.click();
      return { clicked: true };
    }
    return { clicked: false };
  });

  if (toClicked.clicked) {
    await page.waitForTimeout(2000);
    console.log('✓ Clicked "To" dropdown');

    // Type "SGD" to search for Singapore
    console.log('Typing "SGD" to search...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'))
        .filter(el => el.getBoundingClientRect().width > 0);
      for (const input of inputs) {
        input.focus();
        input.value = '';
        input.value = 'SGD';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { typed: true };
      }
      return { typed: false };
    });

    await page.waitForTimeout(2000);
    console.log('✓ Typed "SGD"');

    // Look for and click Singapore/SGD option
    console.log('Looking for Singapore (SGD) option...');
    const sgdClicked = await page.evaluate(() => {
      const allItems = Array.from(document.querySelectorAll('li, [role="option"], div[class*="item"]'))
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map(el => ({
          text: el.textContent.trim(),
          visible: true
        }));

      // Find item containing SGD or Singapore
      for (const item of allItems) {
        if (item.text.includes('SGD') ||
            item.text.includes('Singapore') ||
            item.text.includes('sgd')) {
          item.click();
          return { clicked: true, text: item.text };
        }
      }
      return { clicked: false, items: allItems.slice(0, 10) };
    });

    console.log('SGD click result:', JSON.stringify(sgdClicked, null, 2));

    if (sgdClicked.clicked) {
      await page.waitForTimeout(2000);
      console.log(`✓ Selected: ${sgdClicked.text}`);
    }

    await page.screenshot({ path: 'wu-selected-sgd.png', fullPage: true });
    console.log('✓ Screenshot: wu-selected-sgd.png');
  }

  // Wait for rate to appear and capture it
  await page.waitForTimeout(3000);

  console.log('\nCapturing exchange rate...');
  const rateInfo = await page.evaluate(() => {
    const pageText = document.body.textContent;

    // Look for rate patterns
    const ratePatterns = [
      /(\d+\.?\d*)\s*MMK\s*=\s*(\d+\.?\d*)\s*SGD/i,
      /(\d+\.?\d*)\s*SGD\s*=\s*(\d+\.?\d*)\s*MMK/i,
      /MMK.*?(\d+\.?\d*).*?SGD/i,
      /SGD.*?(\d+\.?\d*).*?MMK/i,
    ];

    for (const pattern of ratePatterns) {
      const match = pageText.match(pattern);
      if (match) {
        return {
          found: true,
          pattern: pattern.toString(),
          match: match[0],
          rate: match[1] || match[2] || 'unknown'
        };
      }
    }

    // Look for FX rate display
    const fxElements = Array.from(document.querySelectorAll('[class*="fx"], [class*="rate"]'))
      .map(el => el.textContent.trim())
      .filter(t => t.includes('=') && (t.includes('MMK') || t.includes('SGD')));

    return {
      found: false,
      fxElements: fxElements.slice(0, 3),
      pageText: pageText.substring(0, 500)
    };
  });

  console.log('Rate info:', JSON.stringify(rateInfo, null, 2));

  // Final screenshot
  await page.screenshot({ path: 'wu-final-rate.png', fullPage: true });
  console.log('✓ Screenshot: wu-final-rate.png');

  await browser.close();
  console.log('\n✅ Done!');
}

getMMKSGDRate().catch(console.error);

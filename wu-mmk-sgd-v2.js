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
  const acceptButton = page.getByText(/accept all/i);
  const acceptCount = await acceptButton.count();
  if (acceptCount > 0) {
    await acceptButton.first().click();
    await page.waitForTimeout(2000);
    console.log('✓ Clicked "Accept all"');
  }

  await page.screenshot({ path: 'wu-step1-start.png' });
  console.log('✓ Screenshot: wu-step1-start.png');

  // Click "From" dropdown
  console.log('\nClicking "From" dropdown...');
  const fromDropdown = await page.evaluate(() => {
    const dropdowns = Array.from(document.querySelectorAll('[class*="senderCurrencyDrop"]'));
    if (dropdowns.length > 0) {
      dropdowns[0].click();
      return { clicked: true };
    }
    return { clicked: false };
  });

  if (fromDropdown.clicked) {
    await page.waitForTimeout(2000);
    console.log('✓ Clicked "From" dropdown');

    // Type MMK to search
    console.log('Typing "MMK" to search...');
    const typed = await page.evaluate(() => {
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

    if (typed.typed) {
      await page.waitForTimeout(2000);
      console.log('✓ Typed "MMK"');

      // Look for MMK/Myanmar text and click
      console.log('Looking for Myanmar option...');
      await page.screenshot({ path: 'wu-step2-mmk-dropdown.png', fullPage: true });
      console.log('✓ Screenshot: wu-step2-mmk-dropdown.png');

      const foundText = await page.evaluate(() => {
        const bodyText = document.body.textContent;
        const hasMMK = bodyText.includes('MMK') || bodyText.includes('Myanmar');
        return { hasMMK };
      });

      console.log('MMK found in dropdown:', JSON.stringify(foundText, null, 2));

      // Try to click by finding element with MMK text
      try {
        await page.getByText(/MMK/i).first().click();
        await page.waitForTimeout(2000);
        console.log('✓ Clicked MMK option');
      } catch (e) {
        console.log('Could not click MMK by text, trying Myanmar...');
        try {
          await page.getByText(/Myanmar/i).first().click();
          await page.waitForTimeout(2000);
          console.log('✓ Clicked Myanmar option');
        } catch (e2) {
          console.log('Could not click Myanmar option either');
        }
      }
    }
  }

  await page.screenshot({ path: 'wu-step3-mmk-selected.png', fullPage: true });
  console.log('✓ Screenshot: wu-step3-mmk-selected.png');

  // Click "To" dropdown
  console.log('\nClicking "To" dropdown...');
  const toDropdown = await page.evaluate(() => {
    const dropdowns = Array.from(document.querySelectorAll('[class*="receiverCurrencyDrop"]'));
    if (dropdowns.length > 0) {
      dropdowns[0].click();
      return { clicked: true };
    }
    return { clicked: false };
  });

  if (toDropdown.clicked) {
    await page.waitForTimeout(2000);
    console.log('✓ Clicked "To" dropdown');

    // Type SGD to search
    console.log('Typing "SGD" to search...');
    const typed = await page.evaluate(() => {
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

    if (typed.typed) {
      await page.waitForTimeout(2000);
      console.log('✓ Typed "SGD"');

      // Look for SGD/Singapore text and click
      console.log('Looking for Singapore option...');
      await page.screenshot({ path: 'wu-step4-sgd-dropdown.png', fullPage: true });
      console.log('✓ Screenshot: wu-step4-sgd-dropdown.png');

      try {
        await page.getByText(/SGD/i).first().click();
        await page.waitForTimeout(2000);
        console.log('✓ Clicked SGD option');
      } catch (e) {
        console.log('Could not click SGD by text, trying Singapore...');
        try {
          await page.getByText(/Singapore/i).first().click();
          await page.waitForTimeout(2000);
          console.log('✓ Clicked Singapore option');
        } catch (e2) {
          console.log('Could not click Singapore option either');
        }
      }
    }
  }

  await page.screenshot({ path: 'wu-step5-sgd-selected.png', fullPage: true });
  console.log('✓ Screenshot: wu-step5-sgd-selected.png');

  // Wait for rate to appear
  await page.waitForTimeout(3000);

  console.log('\nCapturing exchange rate...');
  const rateInfo = await page.evaluate(() => {
    const pageText = document.body.textContent;

    // Look for rate patterns
    const patterns = [
      /(\d+\.?\d*)\s*MMK\s*=\s*(\d+\.?\d*)\s*SGD/i,
      /(\d+\.?\d*)\s*SGD\s*=\s*(\d+\.?\d*)\s*MMK/i,
      /MMK\s*[^\d]*?(\d+\.?\d*)[^\d]*?\s*SGD/i,
    ];

    for (const pattern of patterns) {
      const match = pageText.match(pattern);
      if (match) {
        return { found: true, rate: match[0], from: match[1], to: match[2] };
      }
    }

    // Look for FX rate display
    const fxElement = document.querySelector('[class*="fx"]');
    if (fxElement) {
      return { found: true, fxText: fxElement.textContent.trim() };
    }

    return {
      found: false,
      snippet: pageText.substring(0, 300)
    };
  });

  console.log('Rate info:', JSON.stringify(rateInfo, null, 2));

  await page.screenshot({ path: 'wu-final-rate.png', fullPage: true });
  console.log('✓ Screenshot: wu-final-rate.png');

  await browser.close();
  console.log('\n✅ Done! Check screenshots for rate.');
}

getMMKSGDRate().catch(console.error);

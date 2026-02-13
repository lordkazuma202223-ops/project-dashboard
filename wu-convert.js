const { chromium } = require('playwright-core');

async function getWUConvertRate() {
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

  // Look for and click "Accept All" button
  console.log('\nLooking for "Accept All" button...');
  const acceptClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a')).filter(btn => {
      const text = btn.textContent.toLowerCase();
      return text.includes('accept all') || text.includes('accept cookies');
    });

    if (buttons.length > 0) {
      buttons[0].click();
      return { clicked: true, text: buttons[0].textContent.trim() };
    }
    return { clicked: false, foundButtons: Array.from(document.querySelectorAll('button')).slice(0, 5).map(b => b.textContent.trim()) };
  });

  console.log('Accept button result:', JSON.stringify(acceptClicked, null, 2));

  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'wu-convert-accept.png', fullPage: true });
  console.log('✓ Screenshot saved: wu-convert-accept.png');

  // Look for currency selectors
  console.log('\nLooking for currency dropdowns...');
  const currencyInfo = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select')).map((sel, idx) => ({
      idx,
      name: sel.name,
      id: sel.id,
      className: sel.className,
      visible: sel.getBoundingClientRect().width > 0,
      options: Array.from(sel.options).slice(0, 10).map(o => ({
        value: o.value,
        text: o.text
      }))
    }));

    return { selects };
  });

  console.log('Currency selectors:', JSON.stringify(currencyInfo, null, 2));

  // Try to find and select SGD and MMK
  console.log('\nTrying to select currencies...');

  const selectResult = await page.evaluate(() => {
    // Look for selects that might have currencies
    const selects = Array.from(document.querySelectorAll('select'));

    for (const select of selects) {
      const options = Array.from(select.options);
      const optionTexts = options.map(o => o.text.toLowerCase());

      // Check if this select has SGD and MMK
      const hasSGD = optionTexts.some(t => t.includes('sgd') || t.includes('singapore'));
      const hasMMK = optionTexts.some(t => t.includes('mmk') || t.includes('myanmar'));

      if (hasSGD && hasMMK) {
        return {
          found: true,
          selectName: select.name,
          options: options.slice(0, 15).map(o => ({ value: o.value, text: o.text }))
        };
      }
    }

    return { found: false };
  });

  console.log('Currency selection result:', JSON.stringify(selectResult, null, 2));

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'wu-convert-currencies.png', fullPage: true });
  console.log('✓ Screenshot saved: wu-convert-currencies.png');

  await browser.close();
  console.log('\n✅ Done!');
}

getWUConvertRate().catch(console.error);

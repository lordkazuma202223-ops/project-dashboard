const { chromium } = require('playwright-core');

async function getWURate() {
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

  // Click "Accept All" if present
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

  await page.screenshot({ path: 'wu-1-start.png' });
  console.log('✓ Screenshot: wu-1-start.png');

  // Click on the "From" dropdown
  console.log('\nClicking "From" dropdown...');
  const fromResult = await page.evaluate(() => {
    // Find the first dropdown (From)
    const dropdowns = Array.from(document.querySelectorAll('[class*="select"]'));
    if (dropdowns.length > 0) {
      dropdowns[0].click();
      return { clicked: true };
    }
    return { clicked: false };
  });

  if (fromResult.clicked) {
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'wu-2-from-dropdown.png', fullPage: true });
    console.log('✓ Screenshot: wu-2-from-dropdown.png');

    // Look for MMK in the opened dropdown
    const mmkFound = await page.evaluate(() => {
      const allText = document.body.textContent;
      const hasMMK = allText.includes('MMK') || allText.includes('Myanmar') || allText.includes('myanmar');
      return { hasMMK };
    });

    console.log('MMK found:', JSON.stringify(mmkFound, null, 2));
  }

  // Look for clickable currency options
  console.log('\nLooking for currency/country options...');
  const options = await page.evaluate(() => {
    // Look for all clickable items in dropdowns
    const items = Array.from(document.querySelectorAll('li, [role="option"], [class*="item"]'))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .map((el, idx) => ({
        idx,
        text: el.textContent.trim().substring(0, 50),
        tag: el.tagName,
        className: el.className
      }))
      .slice(0, 20);

    return { items };
  });

  console.log('Options found:', JSON.stringify(options, null, 2));

  await page.screenshot({ path: 'wu-3-options.png', fullPage: true });
  console.log('✓ Screenshot: wu-3-options.png');

  // Try to search for MMK by typing
  console.log('\nTrying to search for MMK...');
  const searchResult = await page.evaluate(() => {
    // Look for input fields
    const inputs = Array.from(document.querySelectorAll('input, [contenteditable="true"]'))
      .filter(el => el.getBoundingClientRect().width > 0);

    for (const input of inputs) {
      const placeholder = input.placeholder || '';
      const type = input.getAttribute('type') || '';

      // Try to type MMK in the first visible input
      if (placeholder.toLowerCase().includes('search') ||
          placeholder.toLowerCase().includes('currency') ||
          placeholder.toLowerCase().includes('country')) {
        input.focus();
        input.value = '';
        input.value = 'MMK';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { typed: true, placeholder, type };
      }
    }
    return { typed: false };
  });

  console.log('Search result:', JSON.stringify(searchResult, null, 2));

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'wu-4-search.png', fullPage: true });
  console.log('✓ Screenshot: wu-4-search.png');

  await browser.close();
  console.log('\n✅ Done! Check screenshots to guide me further.');
}

getWURate().catch(console.error);

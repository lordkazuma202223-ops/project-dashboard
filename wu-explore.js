const { chromium } = require('playwright-core');

async function exploreWUSite() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  // Step 1: Homepage
  console.log('Step 1: Navigating to Western Union homepage...');
  await page.goto('https://www.westernunion.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('✓ Loaded homepage');
  await page.screenshot({ path: 'wu-step1-home.png', fullPage: true });
  console.log('✓ Screenshot: wu-step1-home.png');
  await page.waitForTimeout(2000);

  // Step 2: Click on "Check rates" link
  console.log('\nStep 2: Looking for "Check rates" link...');
  const checkRatesClicked = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button')).filter(el => {
      const text = el.textContent.toLowerCase();
      return text.includes('check rates') || text.includes('exchange rates');
    });

    if (links.length > 0) {
      const link = links[0];
      link.scrollIntoView();
      link.click();
      return { clicked: true, text: link.textContent.trim() };
    }
    return { clicked: false, available: Array.from(document.querySelectorAll('a')).slice(0, 10).map(a => a.textContent.trim()) };
  });

  console.log('Check rates result:', JSON.stringify(checkRatesClicked, null, 2));

  if (checkRatesClicked.clicked) {
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'wu-step2-rates.png', fullPage: true });
    console.log('✓ Screenshot: wu-step2-rates.png');
  } else {
    console.log('❌ Could not find "Check rates" link');
    await page.screenshot({ path: 'wu-step2-home-links.png', fullPage: true });
    console.log('✓ Screenshot: wu-step2-home-links.png');
  }

  // Step 3: Try navigating to send money estimator
  console.log('\nStep 3: Trying send money estimator...');
  await page.goto('https://www.westernunion.com/us/en/web/send-money/start', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  console.log('✓ Loaded send money start page');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'wu-step3-send-start.png', fullPage: true });
  console.log('✓ Screenshot: wu-step3-send-start.png');

  // Step 4: Look for currency dropdowns
  console.log('\nStep 4: Looking for currency selectors...');
  const currencyInfo = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select')).map((sel, idx) => ({
      idx,
      name: sel.name,
      className: sel.className,
      id: sel.id,
      visible: sel.getBoundingClientRect().width > 0,
      options: Array.from(sel.options).slice(0, 5).map(o => ({
        value: o.value,
        text: o.text
      }))
    }));

    const buttons = Array.from(document.querySelectorAll('button')).map((btn, idx) => ({
      idx,
      text: btn.textContent.trim().substring(0, 50),
      className: btn.className,
      visible: btn.getBoundingClientRect().width > 0
    })).slice(0, 10);

    const inputs = Array.from(document.querySelectorAll('input')).map((inp, idx) => ({
      idx,
      type: inp.type,
      name: inp.name,
      placeholder: inp.placeholder || '',
      className: inp.className,
      visible: inp.getBoundingClientRect().width > 0
    })).slice(0, 10);

    return { selects, buttons, inputs };
  });

  console.log('Currency selectors found:', JSON.stringify(currencyInfo, null, 2));

  // Step 5: Try FX page directly
  console.log('\nStep 5: Trying FX rates page...');
  await page.goto('https://www.westernunion.com/us/en/foreign-exchange.html', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  console.log('✓ Loaded FX page');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'wu-step5-fx.png', fullPage: true });
  console.log('✓ Screenshot: wu-step5-fx.png');

  // Step 6: Look for MMK and SGD on FX page
  console.log('\nStep 6: Looking for MMK and SGD on FX page...');
  const fxInfo = await page.evaluate(() => {
    const pageText = document.body.textContent;
    const mmkIndices = [];
    const sgdIndices = [];

    // Find all occurrences
    let pos = 0;
    while ((pos = pageText.indexOf('MMK', pos)) > -1) {
      mmkIndices.push(pos);
      pos += 3;
    }

    pos = 0;
    while ((pos = pageText.indexOf('SGD', pos)) > -1) {
      sgdIndices.push(pos);
      pos += 3;
    }

    // Get context around MMK
    const mmkContexts = mmkIndices.map(idx => ({
      index: idx,
      context: pageText.substring(Math.max(0, idx - 30), Math.min(pageText.length, idx + 30))
    }));

    // Get context around SGD
    const sgdContexts = sgdIndices.map(idx => ({
      index: idx,
      context: pageText.substring(Math.max(0, idx - 30), Math.min(pageText.length, idx + 30))
    }));

    return {
      mmkCount: mmkIndices.length,
      sgdCount: sgdIndices.length,
      mmkContexts: mmkContexts.slice(0, 3),
      sgdContexts: sgdContexts.slice(0, 3),
      hasTables: document.querySelectorAll('table').length,
      hasDropdowns: document.querySelectorAll('select').length
    };
  });

  console.log('FX page info:', JSON.stringify(fxInfo, null, 2));

  await browser.close();
  console.log('\n✅ Done! Check all screenshots.');
}

exploreWUSite().catch(console.error);

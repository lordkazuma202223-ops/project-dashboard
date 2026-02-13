const { chromium } = require('playwright-core');

async function getWUCurrencyRate() {
  // Connect to existing Chrome instance via CDP
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');

  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  console.log('Navigating to Western Union homepage...');
  await page.goto('https://www.westernunion.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('✓ Loaded homepage');

  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'wu-home.png' });
  console.log('✓ Screenshot saved: wu-home.png');

  // Look for currency converter or send money links
  console.log('\nLooking for currency converter links...');

  const links = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('a[href]'));
    const currencyLinks = allLinks
      .map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href'),
        visible: a.getBoundingClientRect().width > 0
      }))
      .filter(l =>
        l.visible &&
        (l.text.toLowerCase().includes('currency') ||
         l.text.toLowerCase().includes('exchange') ||
         l.text.toLowerCase().includes('rate') ||
         l.text.toLowerCase().includes('send money'))
      )
      .slice(0, 5); // Get first 5 relevant links

    return currencyLinks;
  });

  console.log('Found links:', JSON.stringify(links, null, 2));

  // Try to find MMK and SGD in the page
  const currencyInfo = await page.evaluate(() => {
    const text = document.body.textContent;

    // Look for currency codes
    const hasMMK = text.includes('MMK') || text.toLowerCase().includes('myanmar');
    const hasSGD = text.includes('SGD') || text.toLowerCase().includes('singapore');

    // Look for any rate displays
    const rateElements = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const text = el.textContent;
        return text.length < 200 && (
          text.includes('rate') ||
          text.includes('exchange') ||
          text.includes('$') ||
          text.match(/\d+\.\d+/)
        );
      })
      .map(el => ({
        tag: el.tagName,
        text: el.textContent.substring(0, 100),
        className: el.className
      }))
      .slice(0, 10);

    return {
      hasMMK,
      hasSGD,
      rateElements
    };
  });

  console.log('\nCurrency info:', JSON.stringify(currencyInfo, null, 2));

  // Navigate to a simple currency converter alternative
  console.log('\n\nTrying alternative currency converter...');
  await page.goto('https://www.xe.com/currencyconverter/convert/?Amount=1&From=MMK&To=SGD', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  console.log('✓ Loaded XE.com currency converter');

  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'xe-rate.png', fullPage: true });
  console.log('✓ Screenshot saved: xe-rate.png');

  // Extract the rate from XE
  const xeRate = await page.evaluate(() => {
    // Look for the rate display
    const rateText = document.body.textContent;

    // Find rate patterns
    const patterns = [
      /1\s*MMK\s*=\s*([\d.,]+)\s*SGD/i,
      /SGD\s*[\d.,]+\s*=\s*1\s*MMK/i,
      /([\d.,]+)\s*Singapore\s*Dollar/i,
    ];

    for (const pattern of patterns) {
      const match = rateText.match(pattern);
      if (match) {
        return {
          rate: match[1],
          found: true,
          method: pattern.toString()
        };
      }
    }

    // Try to find any number with "MMK" and "SGD" nearby
    const mmkIndex = rateText.indexOf('MMK');
    const sgdIndex = rateText.indexOf('SGD');
    if (mmkIndex > -1 && sgdIndex > -1) {
      const context = rateText.substring(
        Math.max(0, Math.min(mmkIndex, sgdIndex) - 50),
        Math.min(rateText.length, Math.max(mmkIndex, sgdIndex) + 50)
      );
      return {
        rate: 'See context',
        found: true,
        context: context
      };
    }

    return { found: false, snippet: rateText.substring(0, 500) };
  });

  console.log('\nXE Rate info:', JSON.stringify(xeRate, null, 2));

  await browser.close();

  console.log('\n✅ Done! Check screenshots: wu-home.png, xe-rate.png');
}

getWUCurrencyRate().catch(console.error);

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 950 } });
  const scratch = 'C:/Users/USSER/AppData/Local/Temp/claude/c--Elkin-NovaCar/ae206cd1-24d5-4c30-8338-b3883eb0abc6/scratchpad';

  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);

  const state = await page.evaluate(() => {
    const v1 = document.querySelectorAll('.hero-scrub__video')[0];
    return { v1CurrentTime: v1?.currentTime, v1Paused: v1?.paused };
  });
  console.log('PRE_SCROLL_STATE:', JSON.stringify(state));
  await page.screenshot({ path: scratch + '/trimmed-start.png' });
  console.log('ERRORS:', JSON.stringify(errors));

  await browser.close();
})();

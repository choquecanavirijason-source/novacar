const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 950 } });
  const scratch = 'C:/Users/USSER/AppData/Local/Temp/claude/c--Elkin-NovaCar/ae206cd1-24d5-4c30-8338-b3883eb0abc6/scratchpad';

  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => !document.querySelector('.hero-scrub__loader'), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(300);
  await page.screenshot({ path: scratch + '/trimmed-start-clean.png' });
  const state = await page.evaluate(() => document.querySelectorAll('.hero-scrub__video')[0]?.currentTime);
  console.log('CURRENT_TIME:', state);
  await browser.close();
})();

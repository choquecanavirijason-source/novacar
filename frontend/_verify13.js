const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 950 } });

  page.on('console', (msg) => console.log('[browser]', msg.text()));

  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  const samples = [];
  for (let i = 0; i < 24; i++) {
    const s = await page.evaluate(() => {
      const v1 = document.querySelectorAll('.hero-scrub__video')[0];
      return { t: performance.now(), currentTime: v1?.currentTime, readyState: v1?.readyState, duration: v1?.duration };
    });
    samples.push(s);
    await page.waitForTimeout(60);
  }
  console.log('SAMPLES:', JSON.stringify(samples));

  await browser.close();
})();

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to Remotion Studio...");
  await page.goto('http://localhost:3000');
  
  // Wait for the canvas or the studio to render
  await page.waitForTimeout(5000); 
  
  // Click on the NeuroLutaFuga composition on the sidebar if it exists
  try {
    await page.click('text="NeuroLutaFuga"');
    await page.waitForTimeout(2000); // wait for it to load
  } catch(e) {
    console.log("Could not find sidebar link, it might be already open.");
  }
  
  const artifactsDir = 'C:\\Users\\ACPO Empreendimentos\\.gemini\\antigravity\\brain\\e07cce86-6e9d-4e40-bd16-3617e6a37f2d';
  
  console.log("Taking screenshot of frame 0...");
  await page.screenshot({ path: path.join(artifactsDir, 'remotion_frame0.png') });
  
  // Try to skip forward in the video
  // In Remotion studio, we can press ArrowRight to move frames, or we can just run this
  try {
     await page.evaluate(() => {
        window.remotion_setFrame(150); // Usually exposed globally, but let's try keyboard
     });
  } catch(e) {}
  
  for(let i=0; i<30; i++) {
     await page.keyboard.press('ArrowRight');
  }
  await page.waitForTimeout(1000);
  
  console.log("Taking screenshot of later frame...");
  await page.screenshot({ path: path.join(artifactsDir, 'remotion_frame_middle.png') });
  
  await browser.close();
  console.log("Done!");
})();

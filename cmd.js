const puppeteer = require('puppeteer');
const fs = require('fs');
const yargs = require('yargs');

const argv = yargs
  .option('u', {
    alias: 'url',
    describe: 'URL to screenshot',
    type: 'string',
    default: 'https://eyunzhu.com',
  })
  .option('w', {
    alias: 'width',
    describe: 'Viewport width',
    type: 'number',
    default: 1470,
  })
  .option('h', {
    alias: 'height',
    describe: 'Viewport height',
    type: 'number',
    default: 780,
  })
  .option('q', {
    alias: 'quality',
    describe: 'Screenshot quality',
    type: 'number',
    default: 100,
  })
  .option('p', {
    alias: 'path',
    describe: 'Directory to save screenshot',
    type: 'string',
    default: 'data',
  })
  .option('n', {
    alias: 'name',
    describe: 'Screenshot file name',
    type: 'string',
    default: 'screenshot.jpeg',
  })
  .option('f', {
    alias: 'fullPage',
    describe: 'Capture full page',
    type: 'boolean',
    default: false,
  })
  .help('help')
  .argv;

async function autoScroll(page) {
  return page.evaluate(() => {
    return new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    })
  });
}
  

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath:'/usr/bin/google-chrome-stable',//此路径请根据系统中安装google-chrome-stable的实际情况更改;mac下安装了chrome浏览器时，可注释掉
      defaultViewport: { width: argv.width, height: argv.height },
    });
    const page = await browser.newPage();

    await page.goto(argv.url, { waitUntil: 'networkidle2' });
    if(argv.fullPage){
      await autoScroll(page)
    }
    const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: argv.quality, fullPage: argv.fullPage });
    await browser.close();

    const filePath = `${argv.path}/${argv.name}`;
    fs.writeFileSync(filePath, screenshotBuffer);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

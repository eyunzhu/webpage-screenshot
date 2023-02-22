const http = require('http');
const url = require('url');
const puppeteer = require('puppeteer');
const fs = require('fs');

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

const server = http.createServer(async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const urlToScreenshot = queryObject.url ? queryObject.url : 'https://eyunzhu.com';
  const width = queryObject.w ? parseInt(queryObject.w) : 1470;
  const height = queryObject.h ? parseInt(queryObject.h) : 780;
  const quality = queryObject.q ? parseInt(queryObject.q) : 100;
  const path = queryObject.p ? queryObject.p : '';
  const name = queryObject.n ? queryObject.n : 'screenshot.jpeg';
  const download = queryObject.d ? true : false;
  const fullPage = queryObject.f ? true : false;

  if (!urlToScreenshot) {
    res.statusCode = 400;
    res.end('Please provide a URL to screenshot in the "url" parameter');
    return;
  }

  try {
    const browser = await puppeteer.launch({
      executablePath:'/usr/bin/google-chrome-stable',//此路径请根据系统中安装google-chrome-stable的实际情况更改;mac下安装了chrome浏览器时，可注释掉
      defaultViewport: { width, height }});
    const page = await browser.newPage();

    await page.goto(urlToScreenshot, { waitUntil: 'networkidle2' });
    if(fullPage){
      await autoScroll(page)
    }
    const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality, fullPage: fullPage });
    await browser.close();

    if(path){
      const filePath = `${path}/${name}`;
      fs.writeFileSync(filePath, screenshotBuffer);
    }

    if (download) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
      res.end(screenshotBuffer);
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/png');
      res.end(screenshotBuffer);
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('An error occurred while taking the screenshot');
  }
});

const port = 80;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


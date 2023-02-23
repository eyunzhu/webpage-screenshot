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
  const urlToScreenshot = queryObject.url ? queryObject.url : (queryObject.u ? queryObject.u : 'https://eyunzhu.com');
  const width = queryObject.w ? parseInt(queryObject.w) : 1470;
  const height = queryObject.h ? parseInt(queryObject.h) : 780;
  const quality = queryObject.q ? parseInt(queryObject.q) : 100;
  const path = queryObject.p ? queryObject.p : '';
  const name = queryObject.n ? queryObject.n : 'screenshot.jpeg';
  const download = queryObject.d ? true : false;
  const fullPage = queryObject.f ? true : false;
  const t = queryObject.t ? queryObject.t : '';
  const i = queryObject.i ? queryObject.i : '';
  const a = queryObject.a ? queryObject.a : '';

  if (!urlToScreenshot) {
    res.statusCode = 400;
    res.end('Please provide a URL to screenshot in the "url" parameter');
    return;
  }

  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome-stable',//此路径请根据系统中安装google-chrome-stable的实际情况更改;mac下安装了chrome浏览器时，可注释掉
      defaultViewport: { width, height }
    });
    const page = await browser.newPage();

    await page.goto(urlToScreenshot, { waitUntil: 'networkidle2' });
    if (fullPage) {
      await autoScroll(page)
    }
    // add watermark
    await page.evaluate((t, i, a) => {
      const newElement = document.createElement('div');
      newElement.id = 'addWaterElementByeyunzhu';

      // text
      if (t) {
        let waterText = document.createElement('div');
        waterText.innerHTML = t;
        waterText.style = "position: absolute; top: 20px; right: 20px; z-index: 9999; color: red; padding: 10px 20px; background-color: rgb(220 210 210 / 18%); border-radius: 10px;"
        newElement.appendChild(waterText);
      }

      // pic
      if (i) {
        let waterImg = document.createElement('img');
        waterImg.style = "position: absolute; top: 20px; left: 20px; z-index: 9999;";
        waterImg.src = i;
        newElement.appendChild(waterImg);
      }

      // other element
      if (a) {
        let otherDiv = document.createElement('div');
        otherDiv.innerHTML = a;
        newElement.appendChild(otherDiv);
      }
      document.body.appendChild(newElement);
    }, t, i, a);
    // Wait for the watermark to finish loading.
    await page.waitForSelector('#addWaterElementByeyunzhu');

    const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality, fullPage: fullPage });
    await browser.close();

    if (path) {
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

const port = 8080;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


# [webpage-screenshot](https://github.com/eyunzhu/webpage-screenshot)

A Docker image for web page screenshot,add watermark and related services, supporting both command line and HTTP interface. Implemented with node, puppeteer and chrome headless

对目标网页进行截图,添加水印等服务，支持命令行和HTTP方式，使用node,puppeteer和chrome headless技术实现。

**[中文文档](https://github.com/eyunzhu/webpage-screenshot/blob/master/README_zh_CN.md)**

## Running in Docker

### 1. Get the Image

There are two ways to get the image:

1. Pull the image from Docker Hub

   ```shell
   docker pull eyunzhu/webpage-screenshot
   ```

2. Build the image by yourself

   ```shell
   git clone https://github.com/eyunzhu/webpage-screenshot
   cd webpage-screenshot
   docker build -t eyunzhu/webpage-screenshot .
   ```

### 2. Run the Container

```shell
docker run -d -p 1234:80 --cap-add SYS_ADMIN --name screenshot-service eyunzhu/webpage-screenshot
```

The working directory of the image is `/app`. You can mount a local directory `/app/data` to store the screenshots. (You can set the request parameter `p` to `data`)

### 3. Access the Service

Two methods are available:

1. HTTP Interface

   Use the following URL to get the screenshot of the specified website:

   ```
   http://ip:{port}/?u=https://eyunzhu.com
   ```

   #### Request Parameters

   | Parameter | Description                                                  | 默认                |
   | --------- | ------------------------------------------------------------ | ------------------- |
   | u         | Target URL                                                   | https://eyunzhu.com |
   | w         | Screenshot width                                             | 1470                |
   | h         | Screenshot height                                            | 780                 |
   | q         | Screenshot quality percentage                                | 100                 |
   | d         | Download flag (if not empty, download the image)             |                     |
   | p         | Server save path (if not empty, save image to this path on server, ensure path exists) |                     |
   | n         | Image name                                                   | screenshot.jpeg     |
   | f         | If not empty,capture full page                               |                     |
   | t         | Watermark text (use `a` parameter to customize styles).      |                     |
   | i         | URL of the watermark image (use `a` parameter to customize styles). |                     |
   | a         | Add other elements (can be used to add watermarks, etc., with wide flexibility)<br/>Example: <br/>\`<div style="width:100%;height: 100%;position: absolute;top:0;left:0;z-index: 9999;background-color: rgba(220, 210, 210, 0.18);"><h1>eyunzhu</h1><p style="color:#4d85ff">Welcome to use</p></div>\` |                     |

2. Command-Line Interface

   ```shell
   # Enter the container started above and execute the following sample command to generate a screenshot
   # Specify the URL and width parameter
   node cmd.js --url https://eyunzhu.com --width 800
   ```

   Command-line parameters
   
   ```shell
   Options:
         --version      Show version number                               [boolean]
     -u, --url          URL to screenshot [string] [default: "https://eyunzhu.com"]
     -w, --width        Viewport width                     [number] [default: 1470]
     -h, --height       Viewport height                     [number] [default: 780]
     -q, --quality      Screenshot quality                  [number] [default: 100]
     -p, --path         Directory to save screenshot     [string] [default: "data"]
     -n, --name         Screenshot file name  [string] [default: "screenshot.jpeg"]
     -f, --fullPage     Capture full page                [boolean] [default: false]
     -t, --waterText    waterText                            [string] [default: ""]
     -i, --waterImg     waterImg url                         [string] [default: ""]
     -a, --appendChild  Add other elements                   [string] [default: ""]
         --help         Show help                                         [boolean]
   ```

**Request Example:**

The following example shows how to use command line to operate, HTTP requests are similar, just modify accordingly.

```shell
# Default parameter request
node cmd.js
# http://127.0.0.1:1234

# Specify website URL, width, height, and screenshot quality
node cmd.js -u=https://eyunzhu.com -w=147 -h=78 -q=80
# http://127.0.0.1:1234?u=https://eyunzhu.com&w=147&h=78&q=80

# Specify the directory and name to save the screenshot, (note that the directory needs to exist and be writable)
node cmd.js -p=data -n='hello.png'
# http://127.0.0.1:1234?p=data&n=hello.png
# http://127.0.0.1:1234?p=data&n=hello.png&d=1 (setting parameter d will download through the browser)

# Add simple watermark image and watermark text
node cmd.js -i='https://eyunzhu.com/logo.png' -t='This is a simple watermark'
# http://127.0.0.1:1234?i=https%3A%2F%2Feyunzhu.com%2Flogo.png&t=This is a simple watermark

# Add custom watermark
node cmd.js -a '`<div style="width:100%;height: 100%;position: absolute;top:0;left:0;z-index: 9999;background-color: rgba(220, 210, 210, 0.18);"><h1>eyunzhu</h1><p style="color:#4d85ff">Welcome to use</p></div>`'
# http://127.0.0.1:1234?a=`<div style="width:100%;height: 100%;position: absolute;top:0;left:0;z-index: 9999;background-color: rgba(220, 210, 210, 0.18);"><h1>eyunzhu</h1><p style="color:red">Welcome to use</p></div>`
```

## Running Locally

To run locally, you need to install Node, Puppeteer, yargs, and Chrome Browser.

The following example is demonstrated on macOS:

```shell
# Assumes you have already installed Node and Chrome Browser
git clone https://github.com/eyunzhu/webpage-screenshot
cd webpage-screenshot
```

1. HTTP Interface - run `http.js`

   ```shell
   npm install puppeteer yargs #install puppeteer、 yargs
   ```

   ```javascript
   // Before running the script, modify the http.js script with the http server port and the path to google-chrome-stable
   const port = 80;
   const browser = await puppeteer.launch({
     		// Modify the path based on the actual installation of google-chrome-stable on your system. If you have installed Chrome on a Mac, you can comment out this line.
         //executablePath:'/usr/bin/google-chrome-stable',
         defaultViewport: { width, height }});
   ```

   ```shell
   node http.js # start the server
   ```

   Once the server is started, you can call it through http.

2. Command-line Interface (CLI) - run `cmd.js`

   ```javascript
   // Before running the script, modify the cmd.js script with the path to google-chrome-stable
   const browser = await puppeteer.launch({
   			// Modify the path based on the actual installation of google-chrome-stable on your system. If you have installed Chrome on a Mac, you can comment out this line.
         //executablePath:'/usr/bin/google-chrome-stable',
         defaultViewport: { width, height }});
   ```

   ```shell
   # Get started
   node cmd.js --help
   ```

## More Information

For more information, please visit [eyunzhu](https://eyunzhu.com/).


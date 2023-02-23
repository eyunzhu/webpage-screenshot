# [webpage-screenshot](https://github.com/eyunzhu/webpage-screenshot)

一个用于网页截图,添加水印等相关服务的Docker镜像，支持命令行和HTTP接口。使用node、puppeteer和chrome headless实现。

A Docker image for web page screenshot ,add watermark and related services, supporting both command line and HTTP interface. Implemented with node, puppeteer and chrome headless

**[English documentation](https://github.com/eyunzhu/webpage-screenshot/blob/master/README.md)**

## 在docker中运行的方法

### 1. 获取镜像

有两种方法获取镜像：

1. 从Docker Hub获取镜像

   ```shell
   docker pull eyunzhu/webpage-screenshot
   ```

2. 克隆仓库自己构建镜像

   ```shell
   git clone https://github.com/eyunzhu/webpage-screenshot
   cd webpage-screenshot
   docker build -t eyunzhu/webpage-screenshot .
   ```

### 2. 运行容器

```shell
docker run -d -p 1234:8080 --cap-add SYS_ADMIN --name screenshot-service eyunzhu/webpage-screenshot
```

该镜像的工作目录为`/app`，本地可挂载目录`/app/data`，用作保存截图的目录，(即请求参数`p`可以设置为`data`)

### 3. 调用服务

提供两种调用服务的方式：

1. 通过HTTP接口方式

   使用以下URL获取指定网站的截图：

   ```shell
   http://ip:{port}/?u=https://eyunzhu.com
   ```

   #### 请求参数

   | 参数 | 描述                                                         | 默认值                                      |
   | ---- | ------------------------------------------------------------ | ------------------------------------------- |
   | u    | 目标URL                                                      | [https://eyunzhu.com](https://eyunzhu.com/) |
   | w    | 截图宽度                                                     | 1470                                        |
   | h    | 截图高度                                                     | 780                                         |
   | q    | 截图质量百分比                                               | 100                                         |
   | d    | 下载标志（如果非空，下载图像）                               |                                             |
   | p    | 服务器保存路径（如果非空，在服务器上保存图像，确保路径存在） |                                             |
   | n    | 图像名称                                                     | screenshot.jpeg                             |
   | f    | 如果非空，捕获完整页面                                       |                                             |
   | t    | 水印文字文本 (若需自定义样式请使用`a`参数构建)               |                                             |
   | i    | 水印图片网络地址 (若需自定义样式请使用`a`参数构建)           |                                             |
   | a    | 添加其他元素，(可用于添加水印等，自由度较广)<br>示例：\`<div style="width:100%;height: 100%;position: absolute;top:0;left:0;z-index: 9999;background-color: rgba(220, 210, 210, 0.18);"><h1>忆云竹</h1><p style="color:#4d85ff">欢迎使用</p></div>\` |                                             |

2. 通过命令行方式

   ```shell
   # 进入上述启动的容器，然后执行以下示例命令生成截图
   # 指定URL和宽度参数
   node cmd.js --url https://eyunzhu.com --width 800
   ```

   命令行参数

   ```shell
   Options:
         --version   显示版本号                                           [布尔]
     -u, --url       要截图的URL         [字符串] [默认值: "https://eyunzhu.com"]
     -w, --width     视口宽度                               [数字] [默认值: 1470]
     -h, --height    视口高度                                [数字] [默认值: 780]
     -q, --quality   截图质量                                [数字] [默认值: 100]
     -p, --path      保存截图的目录                       [字符串] [默认值: "data"]
     -n, --name      截图文件名称              [字符串] [默认值: "screenshot.jpeg"]
     -f, --fullPage  捕获完整页面                            [布尔] [默认值: false]
     -t, --waterText 水印文字                                 [字符串] [默认值: ""]
     -i, --waterImg  水印图片网络地址                          [字符串] [默认值: ""]
     -a, --appendChild 增加其他元素				                    [字符串] [默认值: ""]
         --help      显示帮助
   ```

**请求示例**：

下方示例使用命令行方式操作，http请求类似,对应更改即可

```shell
# 默认参数请求
node cmd.js
# http://127.0.0.1:1234

# 指定网址、高宽、截图质量
node cmd.js -u=https://eyunzhu.com -w=147 -h=78 -q=80
# http://127.0.0.1:1234?u=https://eyunzhu.com&w=147&h=78&q=80

# 指定截图保存的目录和名称,（此处注意目录需要存在且可写）
node cmd.js -p=data -n='hello.png'
# http://127.0.0.1:1234?p=data&n=hello.png
# http://127.0.0.1:1234?p=data&n=hello.png&d=1 （设置参数d会通过浏览器下载）

# 添加简单水印图片、水印文字
node cmd.js -i='https://eyunzhu.com/logo.png' -t=这是一个简单的水印
# http://127.0.0.1:1234?i=https%3A%2F%2Feyunzhu.com%2Flogo.png&t=这是一个简单的水印

# 添加自定义水印
node cmd.js -a '`<div style="width:100%;height: 100%;position: absolute;top:0;left:0;z-index: 9999;background-color: rgba(220, 210, 210, 0.18);"><h1>忆云竹</h1><p style="color:#4d85ff">欢迎使用</p></div>`'
# http://127.0.0.1:1234?a=`<div style="width:100%;height: 100%;position: absolute;top:0;left:0;z-index: 9999;background-color: rgba(220, 210, 210, 0.18);"><h1>忆云竹</h1><p style="color:red">欢迎使用</p></div>`
```



## 在本地电脑中使用的方法

本地使用前提需要安装Node、Puppeteer、Yargs、Chrome浏览器。

以下在Mac下演示。

```shell
# 前提安装好Node、Chrome浏览器
git clone https://github.com/eyunzhu/webpage-screenshot
cd webpage-screenshot
```

1. HTTP方式，运行 `http.js`

   ```shell
   npm install puppeteer yargs # 安装Puppeteer、Yargs
   ```

   ```javascript
   // 运行脚本前先修改 http.js 脚本中的 HTTP 服务端口和 Google Chrome Stable 路径
   const port = 8080;
   const browser = await puppeteer.launch({
         // 此路径请根据系统中安装 Google Chrome Stable 的实际情况更改；Mac 下安装了 Chrome 浏览器时，可注释掉不写
         //executablePath:'/usr/bin/google-chrome-stable',
         defaultViewport: { width, height }
      });
   ```

   ```shell
   node http.js # 启动服务
   ```

   服务启动后即可通过 HTTP 进行调用。

2. CMD方式，运行 `cmd.js`

   ```javascript
   // 运行脚本前先修改 cmd.js 脚本中的 Google Chrome Stable 路径
   const browser = await puppeteer.launch({
         // 此路径请根据系统中安装 Google Chrome Stable 的实际情况更改；Mac 下安装了 Chrome 浏览器时，可注释掉不写
         //executablePath:'/usr/bin/google-chrome-stable',
         defaultViewport: { width, height }
      });
   ```

   ```shell
   # 开始使用
   node cmd.js --help
   ```

## 更多信息

更多信息请访问 [忆云竹](https://eyunzhu.com/)。
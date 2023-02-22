# [webpage-screenshot](https://github.com/eyunzhu/webpage-screenshot)

一个用于网页截图及相关服务的Docker镜像，支持命令行和HTTP接口。使用node、puppeteer和chrome headless实现。

A Docker image for web page screenshot and related services, supporting both command line and HTTP interface. Implemented with node, puppeteer and chrome headless

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
docker run -d -p 1234:80 --cap-add SYS_ADMIN --name screenshot-service eyunzhu/webpage-screenshot
```

该镜像的工作目录为`/app`，本地可挂载目录`/app/data`，用作保存截图的目录，(即请求参数`p`可以设置为`data`)

### 3. 调用服务

提供两种调用服务的方式：

1. 通过HTTP接口方式

   使用以下URL获取指定网站的截图：

   ```shell
   http://ip:{port}/?url=https://eyunzhu.com
   ```

   #### 请求参数

   | 参数 | 描述                                                         | 默认值                                      |
   | ---- | ------------------------------------------------------------ | ------------------------------------------- |
   | url  | 目标URL                                                      | [https://eyunzhu.com](https://eyunzhu.com/) |
   | w    | 截图宽度                                                     | 1470                                        |
   | h    | 截图高度                                                     | 780                                         |
   | q    | 截图质量百分比                                               | 100                                         |
   | d    | 下载标志（如果非空，下载图像）                               |                                             |
   | p    | 服务器保存路径（如果非空，在服务器上保存图像，确保路径存在） |                                             |
   | n    | 图像名称                                                     | screenshot.jpeg                             |
   | f    | 如果非空，捕获完整页面                                       |                                             |

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
     -u, --url       要截图的URL                       [字符串] [默认值: "https://eyunzhu.com"]
     -w, --width     视口宽度                           [数字] [默认值: 1470]
     -h, --height    视口高度                           [数字] [默认值: 780]
     -q, --quality   截图质量                           [数字] [默认值: 100]
     -p, --path      保存截图的目录                   [字符串] [默认值: "data"]
     -n, --name      截图文件名称           [字符串] [默认值: "screenshot.jpeg"]
     -f, --fullPage  捕获完整页面                       [布尔] [默认值: false]
         --help      显示帮助
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
   const port = 80;
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
FROM node:19-slim
LABEL maintainer="eyunzhu <mail@eyunzhu.com>"
# 更改清华源
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
# 安装google-chrome-stable以及一些字体(安装字体是为了网页截图时正常显示内容)
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google.gpg && \
     echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
# 创建一个非特权用户
RUN adduser --disabled-password --gecos '' appuser
# 创建工作目录并更改所有权
RUN mkdir -p /app/data && chown -R appuser:appuser /app
# 切换到非特权用户
USER appuser
# 创建挂载点
VOLUME /app/data
# 将工作目录设置为/app目录
WORKDIR /app
# 安装puppeteer
RUN npm init -y && npm install puppeteer yargs
# 复制程序文件到容器中
COPY ./http.js ./cmd.js /app/
# 暴露端口
EXPOSE 80
#容器启动执行命令
ENTRYPOINT ["node","http.js"]
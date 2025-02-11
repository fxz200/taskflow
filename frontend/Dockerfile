
# 使用官方 Node.js 作為基底映像
FROM node:20-alpine

# 設定工作目錄
WORKDIR /frontend

# 複製 package.json 和 package-lock.json，先安裝相依性
COPY /my-app/package.json /my-app/yarn.lock ./

# 安裝相依套件
RUN yarn install

# 複製應用程式的所有檔案
COPY /my-app ./

# 編譯 React 專案
RUN yarn run build

# 將應用服務暴露在 3001 端口
EXPOSE 3001

# 啟動 React 應用
CMD ["yarn", "start"]
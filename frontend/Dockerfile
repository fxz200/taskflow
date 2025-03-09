# 使用官方 Node.js 作為基底映像
FROM node:20-alpine

# 設定工作目錄
WORKDIR /frontend

# 複製 package.json 和 yarn.lock，先安裝相依性
COPY app/package.json app/yarn.lock ./

# 安裝相依套件
RUN yarn install --frozen-lockfile

# 複製應用程式的所有檔案
COPY app ./

# 編譯 Next.js 專案
RUN yarn build

# 將應用服務暴露在 3001 端口
EXPOSE 3001

# 啟動 Next.js 應用
CMD ["yarn", "start"]
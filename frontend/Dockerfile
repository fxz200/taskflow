# 第一階段：安裝依賴
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 複製 package.json 和 yarn.lock 來安裝依賴
COPY app/package.json app/yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000

# 第二階段：構建應用
FROM node:20-alpine AS builder
WORKDIR /app

# 複製依賴和源代碼
COPY --from=deps /app/node_modules ./node_modules
COPY app ./

# 構建應用並啟用 standalone 模式
RUN yarn build && \
    yarn install --production --ignore-scripts --prefer-offline && \
    mv .next/standalone ./standalone && \
    mv .next/static ./standalone/.next/static

# 第三階段：運行階段
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# 複製 standalone 文件和 public 資源
COPY --from=builder /app/standalone ./
# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["node", "server.js"]
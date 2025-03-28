# 第一階段：構建階段
FROM golang:1.23.1-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 go.mod 和 go.sum 並下載依賴
COPY go.mod go.sum ./
RUN go mod download

# 複製所有源代碼
COPY . .

# 編譯程式
RUN go build -o main .

# 第二階段：運行階段
FROM alpine:latest

# 設定工作目錄
WORKDIR /app

# 複製編譯好的二進制文件
COPY --from=builder /app/main .

# 複製 swagger.json 文件
COPY --from=builder /app/docs/swagger.json ./docs/swagger.json
COPY --from=builder /app/sql/connect.yaml ./sql/connect.yaml

# 設定執行命令
CMD ["/app/main"]
# 使用 Golang 官方映像
FROM golang:1.23.1

# 設定工作目錄
WORKDIR /app

# 複製檔案
COPY . .

# 安裝依賴
RUN go mod tidy

# 編譯程式
RUN go build -o main .

# 執行應用
CMD ["/app/main"]

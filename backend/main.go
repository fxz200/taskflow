package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // CORS 設置，允許前端請求
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        c.Next()
    })

    // API 路由
    r.GET("/api/message", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Hello from Go backend!"})
    })

    r.Run(":8080") // 監聽 8080 port
}

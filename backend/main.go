package main

import (
	"backend/model"
	"backend/router"
	"backend/sql"
	"fmt"
	"log"
	"net/http"

	_ "backend/docs"

	"github.com/gin-gonic/gin"
)

// MessageResponse 定義返回的結構
type MessageResponse struct {
    Message string `json:"message" example:"Hello from Go backend!"`
}
// @title Taskflow swagger
// @version 1.0
// @description Taskflow swagger

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// schemes http

// @Summary Test API
// @Tags Test
// @version 1.0
// @produce application/json
// @Success 200 {object} MessageResponse "Hello from Go backend!"
// @Router /api/message [get]
// @Example 200 {object} MessageResponse 
func main() {
    if err := sql.InitPostgres(); err != nil {
        panic(err)
    }
    port := 8080
    // sql.Connect.AutoMigrate(&model.Message{}, &model.User{})
    sql.Connect.AutoMigrate(&model.Message{})
    r := router.SetRouter(port)
    //for froentend to access backend
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
    r.GET("/api/message", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Hello from Go backend!"})
    })
    fmt.Println("backend Server Start")
    if err := r.Run(":8080"); err != nil {
        log.Fatalf("backend Server fail: %v", err)
    }
}
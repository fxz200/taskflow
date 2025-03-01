package main

import (
	"backend/model"
	"backend/router"
	"backend/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
    if err := sql.InitPostgres(); err != nil {
        panic(err)
    }
    // sql.Connect.AutoMigrate(&model.Message{}, &model.User{})
    sql.Connect.AutoMigrate(&model.Message{})
    r := router.SetRouter()
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
    //test api
    r.GET("/api/message", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Hello from Go backend!"})
    })
    fmt.Println("backend Server Start")
    if err := r.Run(":8080"); err != nil {
        log.Fatalf("backend Server fail: %v", err)
    }
}
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

func main() {
	if err := sql.InitPostgres(); err != nil {
		panic(err)
	}
	port := 8080
	// sql.Connect.AutoMigrate(&model.Message{}, &model.User{})
	sql.Connect.AutoMigrate(&model.Sprint{}, &model.Member{}, &model.Ticket{})
	r := router.SetRouter(port)
	//for froentend to access backend
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin == "http://localhost:3001" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin) // 僅允許 localhost:3001
		}
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Accept, Authorization, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
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

package router

import (
	"backend/controller"
	"fmt"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetRouter(port int) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin == "http://localhost:3001" || origin == "null" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin) // 僅允許 localhost:3001
		}
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Accept, Authorization, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Accept, Authorization, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	url := ginSwagger.URL(fmt.Sprintf("http://localhost:%d/swagger/doc.json", port))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	sprint := r.Group("api/v1/sprint")
	{
		sprint.GET("", controller.GetAllSprint)
		sprint.POST("", controller.CreateSprint)
		sprint.PUT("", controller.UpdateSprint)
		sprint.DELETE("", controller.DeleteSprint)
	}
	member := r.Group("api/v1/member")
	{
		member.GET("", controller.GetMembers)
		member.POST("", controller.CreateMember)
		member.PUT("", controller.UpdateMember)
		member.DELETE("", controller.DeleteMember)
	}
	ticket := r.Group("api/v1/ticket")
	{
		ticket.GET("", controller.GetTickets)
		ticket.POST("", controller.CreateTicket)
		ticket.PUT("", controller.UpdateTicket)
		ticket.DELETE("", controller.DeleteTicket)
		ticket.GET("/export", controller.ExportChecklist)
	}
	return r
}

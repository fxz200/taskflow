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
	r.RedirectTrailingSlash = false
	url := ginSwagger.URL(fmt.Sprintf("http://localhost:%d/swagger/doc.json", port))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	sprint := r.Group("api/v1/sprint")
	{
		sprint.GET("/", controller.GetAllSprint)
		sprint.POST("/", controller.CreateSprint)
		sprint.PUT("/", controller.UpdateSprint)
		sprint.DELETE("/", controller.DeleteSprint)
	}
	member := r.Group("api/v1/member")
	{
		member.GET("/", controller.GetMembers)
		member.POST("/", controller.CreateMember)
		member.PUT("/", controller.UpdateMember)
		member.DELETE("/", controller.DeleteMember)
	}
	ticket := r.Group("api/v1/ticket")
	{
		ticket.GET("/", controller.GetTickets)
		ticket.POST("/", controller.CreateTicket)
		ticket.PUT("/", controller.UpdateTicket)
		ticket.DELETE("/", controller.DeleteTicket)
	}
	return r
}

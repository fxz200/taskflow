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
	url := ginSwagger.URL(fmt.Sprintf("http://localhost:%d/swagger/doc.json", port))
		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	v1 := r.Group("api/v1")
	{
		v1.POST("/message", controller.Create)
		v1.GET("/message", controller.GetAll)
		v1.GET("/message/:id", controller.Get)
		v1.PATCH("/message/:id", controller.Update)
		v1.DELETE("/message/:id", controller.Delete)
	}
	sprint := r.Group("api/v1/sprint")
	{
		sprint.GET("/", controller.GetAllSprint)
		sprint.POST("/", controller.CreateSprint)
		sprint.PUT("/", controller.UpdateSprint)
		sprint.DELETE("/", controller.DeleteSprint)
	}
	return r
}
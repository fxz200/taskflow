package router

import (
	"backend/controller"

	"github.com/gin-gonic/gin"
)

func SetRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	v1 := r.Group("api/v1")
	{
		v1.POST("/message", controller.Create)
		v1.GET("/message", controller.GetAll)
		v1.GET("/message/:id", controller.Get)
		v1.PATCH("/message/:id", controller.Update)
		v1.DELETE("/message/:id", controller.Delete)
	}
	return r
}
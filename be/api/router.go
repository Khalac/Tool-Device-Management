package api

import (
	"BE_Manage_device/api/handler"
	"BE_Manage_device/api/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, userHandler *handler.UserHandler) {
	//users
	r.Use(middleware.CORSMiddleware())
	api := r.Group("/api")
	api.POST("/register", userHandler.Register)
	api.POST("/login", userHandler.Login)
	api.GET("/activate", userHandler.Activate)
	api.POST("/refresh", userHandler.Refresh)
}

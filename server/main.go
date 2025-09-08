package main

import (
	"server_go/controllers"
	"server_go/initializers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()
}

func main() {
	
	router := gin.Default()
 	router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"}, // frontend URL
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))
	router.POST("api/auth/signup", controllers.CreateUser)
	router.POST("api/auth/login", controllers.Login)
	router.POST("api/tasks/add", controllers.CreateTask)
	router.GET("api/tasks",  controllers.GetALLTask)
	router.DELETE("api/tasks/:id", controllers.DeleteTask)
	router.PUT("api/tasks/:id", controllers.DoneTask)
	router.POST("api/tasks/:id", controllers.UpdateTask)
	router.Run()
}
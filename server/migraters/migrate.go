package main

import (
	"server_go/initializers"
	"server_go/models"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()

}

func main() {
     initializers.DB.AutoMigrate(&models.Task{})
	
     initializers.DB.AutoMigrate(&models.User{})
}
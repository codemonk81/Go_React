package controllers

import (
	"net/http"
	"server_go/initializers"
	"server_go/models"

	"github.com/gin-gonic/gin"
)

func CreateTask(c *gin.Context){
	var taskInput models.Task
	if err := c.ShouldBindJSON(&taskInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	initializers.DB.Create(&taskInput)

	c.JSON(http.StatusOK, gin.H{"data": taskInput})
}

func GetALLTask(c *gin.Context) {
	var tasks []models.Task
	result := initializers.DB.Find(&tasks)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

func DoneTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	initializers.DB.Where("id=?", id).First(&task)

	if task.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "task not found"})
		return
	}
	if task.State == 2 {
		c.JSON(http.StatusOK, gin.H{"message": "Task state is already complete"}) // Or return an error if that's unexpected  
		return  
	}  
	if task.State == 1{
		task.State = 2
		if err := initializers.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	}
	if task.State == 0 {
		task.State = 1 	
		if err := initializers.DB.Save(&task).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"data": task})
}
func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var taskInput models.Task
	if err := c.ShouldBindJSON(&taskInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var task models.Task
	if err:= initializers.DB.Where("id=?", id).First(&task).Error; err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": "task not found"})
		return
	}
	
	task.Title = taskInput.Title
	task.Description = taskInput.Description
	if err:= initializers.DB.Save(&task).Error; err!= nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed Save"})
	}
	c.JSON(http.StatusOK, gin.H{"task": task})
}


func DeleteTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	

	if err:= initializers.DB.Where("id=?", id).Delete(&task).Error; err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": "task not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": "Deleted the Task"})
}

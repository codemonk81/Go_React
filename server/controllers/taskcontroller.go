package controllers

import (
	"net/http"
	"server_go/initializers"
	"server_go/models"

	"github.com/gin-gonic/gin"
)

// CreateTask handles the creation of a new task.
// It binds the JSON input to the Task model, creates the task in the database,
// and returns the created task as JSON.
func CreateTask(c *gin.Context) {  
	var taskInput models.Task  

	// Bind the JSON input to the taskInput variable.  
	if err := c.ShouldBindJSON(&taskInput); err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})  
		return  
	}  

	// Create the task in the database.  
	initializers.DB.Create(&taskInput)  

	// Return the created task as JSON.  
	c.JSON(http.StatusOK, gin.H{"data": taskInput, "msg": "Task created successfully!"})  
}  

// GetALLTask retrieves all tasks from the database.  
// It fetches all tasks, handles potential errors, and returns the tasks as JSON.  
func GetALLTask(c *gin.Context) {  
	var tasks []models.Task  

	// Find all tasks in the database.  
	result := initializers.DB.Find(&tasks)  
	if result.Error != nil {  
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})  
		return  
	}  

	// Return the tasks as JSON.  
	c.JSON(http.StatusOK, gin.H{"tasks": tasks, "msg": "All tasks got successfully!"})  
}  

// DoneTask updates the state of a task.  
// It retrieves the task by ID, checks its current state, and updates it accordingly.  
// The updated task is then saved to the database.  
func DoneTask(c *gin.Context) {  
	id := c.Param("id")  
	var task models.Task  

	// Retrieve the task from the database by ID.  
	initializers.DB.Where("id=?", id).First(&task)  

	// Check if the task exists.  
	if task.ID == 0 {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "task not found"})  
		return  
	}  

	//If task is already complete, return message  
	if task.State == 2 {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "Task state is already complete"}) // Or return an error if that's unexpected  
		return  
	}  

	// Update the task state based on its current state.  
	if task.State == 1 {  
		// If the task is in REVIEW, set to COMPLETE.  
		task.State = 2  
		if err := initializers.DB.Save(&task).Error; err != nil {  
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})  
			return  
		}  
	}  
	if task.State == 0 {  
		// If the task is IN_PROGRESS, set to REVIEW.  
		task.State = 1  
		if err := initializers.DB.Save(&task).Error; err != nil {  
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})  
			return  
		}  
	}  

	// Return the updated task as JSON.  
	c.JSON(http.StatusOK, gin.H{"data": task})  
}  

// UpdateTask updates the title and description of an existing task.  
// It retrieves the task by ID, binds the JSON input, updates the task fields,  
// and saves the updated task to the database.  
func UpdateTask(c *gin.Context) {  
	id := c.Param("id")  
	var taskInput models.Task  

	// Bind the JSON input to the taskInput variable.  
	if err := c.ShouldBindJSON(&taskInput); err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})  
		return  
	}  

	var task models.Task  

	// Retrieve the task from the database by ID.  
	if err := initializers.DB.Where("id=?", id).First(&task).Error; err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "task not found"})  
		return  
	}  

	// Update the task fields with the new values.  
	task.Title = taskInput.Title  
	task.Description = taskInput.Description  

	// Save the updated task to the database.  
	if err := initializers.DB.Save(&task).Error; err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed Save"})  
	}  

	// Return the updated task as JSON.  
	c.JSON(http.StatusOK, gin.H{"task": task, "msg": "Task updated successfully!"})  
}  

// DeleteTask deletes a task from the database.  
// It retrieves the task by ID and deletes it.  
func DeleteTask(c *gin.Context) {  
	id := c.Param("id")  
	var task models.Task  

	// Delete the task from the database.  
	if err := initializers.DB.Where("id=?", id).Delete(&task).Error; err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "task not found"})  
		return  
	}  

	// Return a success message as JSON.  
	c.JSON(http.StatusOK, gin.H{"msg": "Task deleted"})  
}
package controllers

import (
	"encoding/json"
	"golang-crud-rest-api/database"
	"golang-crud-rest-api/entities"
	"net/http"

	"github.com/gorilla/mux"
)

func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var task entities.Task
	json.NewDecoder(r.Body).Decode(&task)
	database.Instance.Create(&task)
	json.NewEncoder(w).Encode(task)
}

func GetTaskById(w http.ResponseWriter, r *http.Request) {
	taskId := mux.Vars(r)["id"]
	if checkIfTaskExists(taskId) == false {
		json.NewEncoder(w).Encode("Task Not Found!")
		return
	}
	var task entities.Task
	database.Instance.First(&task, taskId)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func GetTasks(w http.ResponseWriter, r *http.Request) {
	var tasks []entities.Task
	database.Instance.Find(&tasks)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	taskId := mux.Vars(r)["id"]
	if checkIfTaskExists(taskId) == false {
		json.NewEncoder(w).Encode("Task Not Found!")
		return
	}
	var task entities.Task
	database.Instance.First(&task, taskId)
	json.NewDecoder(r.Body).Decode(&task)
	database.Instance.Save(&task)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	taskId := mux.Vars(r)["id"]
	if checkIfTaskExists(taskId) == false {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("Task Not Found!")
		return
	}
	var task entities.Task
	database.Instance.Delete(&task, taskId)
	json.NewEncoder(w).Encode("Task Deleted Successfully!")
}

func checkIfTaskExists(taskId string) bool {
	var task entities.Task
	database.Instance.First(&task, taskId)
	if task.ID == 0 {
		return false
	}
	return true
}

package models

import (
	"time"
)

type Task struct {
	ID        uint   `json:"id" gorm:"primary_key"`
	Title  string `json:"title"`
	Description  string `json:"description"`
	State	int8	`json:"state"`
	CreatedAt time.Time `json:"created_at" gorm:"type:timestamp"`
	UpdatedAt time.Time `json:"updated_at" gorm:"type:timestamp"`
}
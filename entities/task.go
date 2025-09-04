package entities

type Task struct {
	ID          uint    `json:"id"`
	Title        string  `json:"title"`	
	Done string  `json:"done"`
}
package initializers

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DB_URL")
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		PrepareStmt: true,
    	NowFunc: func() time.Time {
        return time.Now().UTC()
    },
	})

	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}
}
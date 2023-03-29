package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Database *gorm.DB

func Connect() {
	connection, err := gorm.Open(mysql.Open("root:password@tcp(db:3306)/huovet"), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}

	Database = connection
}

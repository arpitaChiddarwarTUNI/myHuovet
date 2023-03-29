package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Database *gorm.DB

func Connect() {

	//"root:password@tcp(localhost:3307)/huovet"
	//"root:password@tcp(db:3306)/huovet"
	connection, err := gorm.Open(mysql.Open("root:password@tcp(db:3306)/huovet"), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}

	Database = connection
}

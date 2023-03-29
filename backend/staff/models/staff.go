package models

import (
	"database/sql"
)

type StaffJSON struct {
	Id 			int   `json:"id"`
	FirstName 	string `json:"first_name" example:"Elon"`
	LastName 	string `json:"last_name" example:"Musk"`
	Role 		string `json:"role" example:"Lääkäri"`
}

type StaffDB struct {
	Id 			int   `json:"id"`
	FirstName 	string `json:"first_name" example:"Elon"`
	LastName 	string `json:"last_name" example:"Musk"`
	Role 		sql.NullString `json:"role"`
}




type StaffAddJSON struct {
	FirstName 	string `json:"first_name" example:"Elon"`
	LastName 	string `json:"last_name" example:"Musk"`
	Role 		string `json:"role" example:"Lääkäri"`
}
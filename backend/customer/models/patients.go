package models

import "database/sql"

type Patient struct {
	Id   int    `json:"id" example:"1"`
	Name string `json:"name" example:"Muppe"`
}
type PatientDB struct {
	Id          int            `json:"id"`
	Name        string         `json:"name" example:"Puppe"`
	Sex         string         `json:"sex" example:"Male"`
	Weight      sql.NullInt64  `json:"weight"`
	Microchip   sql.NullString `json:"microchip"`
	DateOfBirth sql.NullString `json:"dateOfBirth" db:"date_of_birth"`
	CustomerId  int            `json:"customerId" db:"customer_id" example:"1"`
	BreedId     int            `json:"breedId" db:"breed_id" example:"1"`
}

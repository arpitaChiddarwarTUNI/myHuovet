package models

import (
	"database/sql"
)

type PatientJSON struct {
	Id 				int   `json:"id"`
	Name 			string `json:"name" example:"Puppe"`
	Sex 			string `json:"sex" example:"Male"`
	Weight			int64 `json:"weight,omitempty" example:"12"`
	Microchip 		string `json:"microchip" example:"abcdefg12345"`
	DateOfBirth		string `json:"dateOfBirth,omitempty" db:"date_of_birth" example:"2022-05-11"`
	CustomerId 		int `json:"customerId" db:"customer_id" example:"1"`
	BreedId			int `json:"breedId" db:"breed_id" example:"1"`
}

type PatientDB struct {
	Id 				int   `json:"id"`
	Name 			string `json:"name" example:"Puppe"`
	Sex 			string `json:"sex" example:"Male"`
	Weight			sql.NullInt64 `json:"weight"`
	Microchip 		sql.NullString `json:"microchip"`
	DateOfBirth		sql.NullString `json:"dateOfBirth" db:"date_of_birth"`
	CustomerId 		int `json:"customerId" db:"customer_id" example:"1"`
	BreedId			int `json:"breedId" db:"breed_id" example:"1"`
}

type PatientAddJSON struct {
	Name 			string `json:"name" example:"Puppe"`
	Sex 			string `json:"sex" example:"Male"`
	Weight			int64 `json:"weight,omitempty" example:"12"`
	Microchip 		string `json:"microchip,omitempty" example:"abcdefg12345"`
	DateOfBirth		string `json:"dateOfBirth,omitempty" db:"date_of_birth" example:"2022-05-11"`
	CustomerId 		int `json:"customerId" db:"customer_id" example:"1"`
	BreedId			int `json:"breedId" db:"breed_id" example:"1"`
}

package models

import "database/sql"

type Customer struct {
	Id            uint   `json:"id" example:"1"`
	FirstName     string `json:"first_name" example:"Elon"`
	LastName      string `json:"last_name" example:"Musk"`
	StreetAddress string `json:"street_address" example:"exampleavenue 2"`
	ZipCode       string `json:"zip_code" example:"33720"`
	Municipality  string `json:"municipality" example:"Tampere"`
	PhoneNumber   string `json:"phone_number" example:"+358 123456789"`
	Email         string `json:"email" gorm:"unique" example:"testi@tuni.fi"`
	Ssn           string `json:"ssn" example:"010100-123A"`

	//field for animals owned by customer?

	//social security number????????
	//SocialSecurityNumber string `json:"socialsecuritynumber" example:"010190-123A"`
}

type CustomerByIdBody struct {
	Id uint `json:"id" example:"1"`
}

type CreateCustomerBody struct {
	FirstName     string `json:"first_name" example:"Elon"`
	LastName      string `json:"last_name" example:"Musk"`
	StreetAddress string `json:"street_address" example:"exampleavenue 2"`
	ZipCode       string `json:"zip_code" example:"33720"`
	Municipality  string `json:"municipality" example:"Tampere"`
	PhoneNumber   string `json:"phone_number" example:"+358 123456789"`
	Email         string `json:"email" gorm:"unique" example:"testi@tuni.fi"`
	Ssn           string `json:"ssn" example:"010100-123A"`
}

type ModifyCustomerBody struct {
	Id            string `json:"id" example:"1"`
	FirstName     string `json:"first_name" example:"Elon"`
	LastName      string `json:"last_name" example:"Musk"`
	StreetAddress string `json:"street_address" example:"exampleavenue 2"`
	ZipCode       string `json:"zip_code" example:"33720"`
	Municipality  string `json:"municipality" example:"Tampere"`
	PhoneNumber   string `json:"phone_number" example:"+358 123456789"`
	Email         string `json:"email" gorm:"unique" example:"testi@tuni.fi"`
	Ssn           string `json:"ssn" example:"010100-123A"`

	//field for animals owned by customer?

	//social security number????????
	//SocialSecurityNumber string `json:"socialsecuritynumber" example:"010190-123A"`
}

type CustomerDB struct {
	Id            uint           `json:"id" example:"1" db:"id"`
	FirstName     string         `json:"first_name" example:"Elon" db:"first_name"`
	LastName      string         `json:"last_name" example:"Musk" db:"last_name"`
	StreetAddress sql.NullString `json:"street_address"  db:"street_address"`
	ZipCode       sql.NullString `json:"zip_code"  db:"zip_code"`
	Municipality  sql.NullString `json:"municipality"  db:"municipality"`
	PhoneNumber   sql.NullString `json:"phone_number" db:"phone_number"`
	Email         sql.NullString `json:"email" gorm:"unique" db:"email"`
	Ssn           sql.NullString `json:"ssn"  db:"ssn"`

	//field for animals owned by customer?

	//social security number????????
	//SocialSecurityNumber string `json:"socialsecuritynumber" example:"010190-123A"`
}

type CustomerSearch struct {
	Id        uint   `json:"id" example:"1" db:"id"`
	FirstName string `json:"first_name" example:"Elon" db:"first_name"`
	LastName  string `json:"last_name" example:"Musk" db:"last_name"`
}

type CustomerSearchBody struct {
	SearchWord string `json:"search" example:"Musk" db:"search"`
}

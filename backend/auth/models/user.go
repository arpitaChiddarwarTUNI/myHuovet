package models

type User struct {
	Id 			uint   `json:"id" example:"1"`
	FirstName 	string `json:"firstName" example:"Elon"`
	LastName 	string `json:"lastName" example:"Musk"`
	Email 		string `json:"email" gorm:"unique" example:"testi@tuni.fi"`
	Password 	[]byte `json:"-"`
}

type LoginRequestBody struct {
	Email    string `json:"email" example:"testi@tuni.fi"`
	Password string `json:"password" example:"qwerty"`
}

type RegisterRequestBody struct {
	FirstName     	string `json:"firstName" example:"Elon"`
	LastName     	string `json:"lastName" example:"Musk"`
	Email    		string `json:"email" example:"testi@tuni.fi"`
	Password 		string `json:"password" example:"qwerty"`
}
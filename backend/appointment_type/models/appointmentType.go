package models


type AppointmentType struct {
	Id 				int   `json:"id"`
	Name	 		string `json:"name" example:"tarkistus"`
	DefaultLength 	int `json:"default_length" example:"20"`
}

type AppointmentTypeAddJSON struct {
	Name	 	string `json:"name" example:"laastari"`
	DefaultLength 	int `json:"default_length" example:"20"`
}


package models

type ExaminationtypeDB struct {
	Id       int     `json:"id"`
	Name     string  `json:"name" example:"check"`
	Category string  `json:"category" example:"examination"`
	Price    float32 `json:"price" example:"9.20"`
	Location string  `json:"location" example:"Tampere"`
}

type ExaminationtypeAddJSON struct {
	Name     string  `json:"name" example:"check"`
	Category string  `json:"category" example:"examination"`
	Price    float32 `json:"price" example:"9.20"`
	Location string  `json:"location" example:"Tampere"`
}

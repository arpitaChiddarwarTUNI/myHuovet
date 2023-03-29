package models

type Supply struct {
	Id     int     `json:"id"`
	Number string  `json:"number" example:"P001"`
	Name   string  `json:"name" example:"laastari"`
	Type   string  `json:"type" example:"medicine"`
	Unit   string  `json:"unit" example:"ml"`
	Price  float32 `json:"price" example:"3.5"`
}

type SupplyAddJSON struct {
	Name  string  `json:"name" example:"laastari"`
	Type  string  `json:"type" example:"medicine"`
	Unit  string  `json:"unit" example:"ml"`
	Price float32 `json:"price" example:"3.5"`
}

type SupplyGetJSON struct {
	Param string `json:"param" example:"name or number"`
	Value string `json:"value" example:"Aspirine or P001"`
}

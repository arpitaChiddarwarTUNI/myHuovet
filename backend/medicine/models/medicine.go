package models

type MedicineJSON struct {
	Id              int    `json:"id" example:"1"`
	Name            string `json:"name" example:"burana"`
	Unit            string `json:"unit" example:"ml"`
	ActiveSubstance string `json:"active_substance" example:"ibuprofein"`
	Strength        string  `json:"strength" example:"400 mg"`
}

type MedicineDB struct {
	Id              int    `json:"id" ample:"1"`
	Name            string `json:"name" example:"burana"`
	Unit            string `json:"unit" example:"ml"`
	ActiveSubstance string `json:"active_substance" example:"ibuprofein"`
	Strength        string `json:"strength" example:"400 mg"`
}

type MedicineAddJSON struct {
	Name            string `json:"name" example:"burana"`
	Unit            string `json:"unit" example:"ml"`
	ActiveSubstance string `json:"active_substance" example:"ibuprofein"`
	Strength        string `json:"strength" example:"400 mg"`
}

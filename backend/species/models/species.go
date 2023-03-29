package models

type SpeciesJSON struct {
	Name string `json:"name" example:"Dog"`
}

type SpeciesDB struct {
	Id   int    `json:"id" sql:"AUTO_INCREMENT" gorm:"primary_key`
	Name string `json:"name" example:"Dog"`
}

type SpeciesBreedDB struct {
	Id     int       `json:"id" sql:"AUTO_INCREMENT" gorm:"primary_key`
	Name   string    `json:"name" example:"Dog"`
	Breeds []BreedDB `gorm:"-"`
}

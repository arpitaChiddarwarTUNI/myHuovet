package models

import "database/sql"

type BreedBodyJSON struct {
	Name          string `json:"name" example:"dachshund"`
	AverageWeight int    `json:"average_weight" example:"11000"`
	SpeciesId     int    `json:"species_id" example:"1"`
}

type BreedJSON struct {
	Id            int    `json:"id" sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Name          string `json:"name" example:"dachshund"`
	AverageWeight int    `json:"average_weight" example:"300"`
	SpeciesId     int    `json:"species_id" example:"1"`
}

type BreedDB struct {
	Id            int           `json:"id" sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Name          string        `json:"name" example:"Dog"`
	AverageWeight sql.NullInt64 `json:"average_weight"`
	SpeciesId     int           `json:"species_id" example:"1"`
}

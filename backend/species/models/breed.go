package models

import "database/sql"

type BreedDB struct {
	Id            int           `json:"id" sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Name          string        `json:"name" example:"Dog"`
	AverageWeight sql.NullInt64 `json:"average_weight"`
	SpeciesId     int           `json:"species_id" example:"1"`
}

type BreedSimpleDB struct {
	Id   int    `json:"id" sql:"AUTO_INCREMENT" gorm:"primary_key"`
	Name string `json:"name" example:"Dog"`
}

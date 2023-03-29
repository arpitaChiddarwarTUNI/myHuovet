package models

import (
	"database/sql"
)

type DiagnosisJSON struct {
	Id   int    `json:"id"`
	Name string `json:"name" example:"fever"`
	Code string `json:"code" example:"abc"`
}

type DiagnosisDB struct {
	Id   int            `json:"id"`
	Name string         `json:"name" example:"fever"`
	Code sql.NullString `json:"code"`
}

type DiagnosisAddJSON struct {
	Name string `json:"name" example:"fever"`
	Code string `json:"code" example:"abc"`
}

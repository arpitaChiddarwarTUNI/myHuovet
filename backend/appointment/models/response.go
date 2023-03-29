package models

type AddResponse struct {
	Message string `json:"message" example:"add success"`
}

type UpdateResponse struct {
	Message string `json:"message" example:"update success"`
}


type DeleteResponse struct {
	Message string `json:"message" example:"delete success"`
}

type DeleteFAilResponse struct {
	Message string `json:"message" example:"deleting fail"`
}


type SearchFailResponse struct {
	Message string `json:"message" example:"searching fail"`
}

type AlreadyBilledResponse struct {
	Message string `json:"message" example:"appointment is already billed"`
}

type UnathenticatedResponse struct {
	Message string `json:"message" example:"unauthenticated"`
}
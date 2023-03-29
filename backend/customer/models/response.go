package models

type CustomerNotFoundResponse struct {
	Message string `json:"message" example:"customer not found"`
}

type CreateSuccessfulResponse struct {
	Message string `json:"message" example:"Create successful"`
}

type CustomerAlreadyExistsResponse struct {
	Message string `json:"message" example:"customer already exists"`
}

type MofidyFailureResponse struct {
	Message string `json:"message" example:"Modiy Failure"`
}

// or should it return the new customer struct?
type ModifySuccessfulResponse struct {
	Message string `json:"message" example:"modify successful"`
}
type ModifyFailureResponse struct {
	Message string `json:"message" example:"modify successful"`
}

type CustomerRemovedResponse struct {
	Message string `json:"message" example:"remove successful"`
}

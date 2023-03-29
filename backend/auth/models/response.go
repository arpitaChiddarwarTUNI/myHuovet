package models

type UserNotFoundResponse struct {
	Message string `json:"message" example:"user not found"`
}

type IncorrectPasswordResponse struct {
	Message string `json:"message" example:"incorrect password"`
}

type LoginFailResponse struct {
	Message string `json:"message" example:"login fail"`
}

type LoginSuccessResponse struct {
	Message string `json:"message" example:"login success"`
}


type RegisterResponse struct {
	Message string `json:"message" example:"email is already in use"`
}

type RegisterSuccessResponse struct {
	Message string `json:"message" example:"register success"`
}


type LogoutResponse struct {
	Message string `json:"message" example:"logout success"`
}


type UnathenticatedResponse struct {
	Message string `json:"message" example:"unauthenticated"`
}
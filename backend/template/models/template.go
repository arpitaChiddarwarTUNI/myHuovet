package models


type Template struct {
	Id 						int   `json:"id"`
	Type 					string `json:"type" example:"treatment"`
	TemplateText	 		string `json:"template_text" example:"testi"`
	AppointmentTypeId 		int `json:"appointment_type_id" example:"1"`
}

type TemplateAddJSON struct {
	Type 					string `json:"type" example:"treatment"`
	TemplateText	 		string `json:"template_text" example:"testi"`
	AppointmentTypeId 		int `json:"appointment_type_id" example:"1"`
}


package models


type Bill struct {
	BillNumber 			int		`json:"bill_number" db:"bill_number" example:"9876543"`
	AppointmentId	 	int 	`json:"appointment_id" db:"appointment_id" example:"1"`
	DueDate 			string 	`json:"due_date" db:"due_date" example:"2022-10-20T10:00:00"`
	Paid 				bool 	`json:"paid" db:"paid" example:"true"`
	ServicePrice		float32 `json:"service_price" db:"service_price" example:"35.00"`
	Supplies 			[]GetSupply
	Examinations 		[]GetExamination
}

type BillDB struct {
	BillNumber 			int		`json:"bill_number" db:"bill_number" gorm:"primaryKey" example:"9876543"`
	AppointmentId	 	int 	`json:"appointment_id" db:"appointment_id" example:"1"`
	DueDate 			string 	`json:"due_date" db:"due_date" example:"2022-10-20T10:00:00"`
	Paid 				bool 	`json:"paid" db:"paid" example:"true"`
	ServicePrice		float32 `json:"service_price" db:"service_price" example:"35.00"`
}

type BillAddJSON struct {
	AppointmentId	 	int 	`json:"appointment_id" example:"1"`
	DueDate 			string 	`json:"due_date" db:"due_date" example:"2022-10-20T10:00:00"`
	Paid 				bool 	`json:"paid" db:"paid" example:"true"`
	ServicePrice		float32 `json:"service_price" db:"service_price" example:"35.00"`
	Supplies 			[]Supply
	Examinations 		[]Examination
}


type Supply struct {
	SuppliesId 	int		`json:"supplies_id" db:"supplies_id" example:"1"`
	Amount		int		`json:"amount" example:"3"`
	Price		float32 `json:"price" example:"3.5"`
}

type GetSupply struct {
	SuppliesId 	int		`json:"supplies_id" db:"supplies_id" example:"1"`
	Amount		int		`json:"amount" example:"3"`
	Name		string	`json:"name" example:"laastari"`
	Price		float32 `json:"price" example:"3.5"`
}


type Examination struct {
	ExaminationTypeId 	int		`json:"examination_type_id" db:"examination_type_id" example:"1"`
	Price				float32 `json:"price" example:"30.99"`
}

type GetExamination struct {
	ExaminationTypeId 	int		`json:"examination_type_id" db:"examination_type_id" example:"1"`
	Name				string	`json:"name" example:"röntgen"`
	Price				float32 `json:"price" example:"30.99"`
}


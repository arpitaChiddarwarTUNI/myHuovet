package models

import (
	"database/sql"
)

type ExaminationDB struct {
	ExaminationTypeId int    `json:"examination_type_id" db:"examination_type_id"`
	PatientId         int    `json:"patient_id" db:"patient_id"`
	AppointmentId     int    `json:"appointment_id" db:"appointment_id"`
	Result            string `json:"result" db:"result"`
}

type ExaminationJSON struct {
	ExaminationTypeId int    `json:"examination_type_id" db:"examination_type_id"`
	Result            string `json:"result" db:"result"`
}

type GetExamination struct {
	ExaminationTypeId int     `json:"examination_type_id" db:"examination_type_id" example:"2"`
	Name              string  `json:"name" db:"name" example:"röntgen"`
	Result            string  `json:"result" db:"result" example:"Riiki on"`
	Category          string  `json:"category" db:"category" example:"examination or operation"`
	Price             float32 `json:"price" db:"price" example:"25"`
	Location          string  `json:"location" db:"logation" example:"tampere"`
}

type DiagnosedDB struct {
	DiagnosisId   int    `json:"diagnosis_id" db:"diagnosis_id"`
	PatientId     int    `json:"patient_id" db:"patient_id"`
	AppointmentId int    `json:"appointment_id" db:"appointment_id"`
	InfoText      string `json:"info_text" db:"info_text"`
}

type DiagnosedJSON struct {
	DiagnosisId int    `json:"diagnosis_id"`
	InfoText    string `json:"info_text"`
}

type GetDiagnosed struct {
	DiagnosisId int    `json:"diagnosis_id" db:"diagnosis_id" example:"2"`
	Name        string `json:"name" db:"name" example:"kuume"`
	Code        string `json:"code" db:"code" example:"13"`
	InfoText    string `json:"info_text" db:"info_text" example:"Kova kuume"`
}

type UsedDB struct {
	SuppliesId    int `json:"supplies_id" db:"supplies_id"`
	PatientId     int `json:"patient_id" db:"patient_id"`
	AppointmentId int `json:"appointment_id" db:"appointment_id"`
	Amount        int `json:"amount" db:"amount"`
}

type UsedJSON struct {
	SuppliesId int `json:"supplies_id" db:"supplies_id"`
	Amount     int `json:"amount" db:"amount"`
}

type GetUsed struct {
	SuppliesId int     `json:"supplies_id" db:"supplies_id" example:"2"`
	Amount     int     `json:"amount" db:"amount" example:"1"`
	Name       string  `json:"name" db:"name" example:"koiran ruoka"`
	Type       string  `json:"type" db:"type" example:"food"`
	Unit       string  `json:"unit" db:"unit" example:"pcs"`
	Price      float32 `json:"price" db:"price" example:"4.5"`
}

type PrescribedDB struct {
	MedicineId    int `json:"medicine_id" db:"medicine_id"`
	PatientId     int `json:"patient_id" db:"patient_id"`
	AppointmentId int `json:"appointment_id" db:"appointment_id"`
	Dosage        int `json:"dosage" db:"dosage"`
	Amount        int `json:"amount" db:"amount"`
}

type PrescribedJSON struct {
	MedicineId int `json:"medicine_id" db:"medicine_id"`
	Dosage     int `json:"dosage" db:"dosage"`
	Amount     int `json:"amount" db:"amount"`
}

type GetPrescribed struct {
	MedicineId int    `json:"medicine_id" db:"medicine_id" example:"1"`
	Dosage     int    `json:"dosage" db:"dosage" example:"2"`
	Amount     int    `json:"amount" db:"amount" example:"3"`
	Name       string `json:"name" db:"name" example:"burana"`
	Unit       string `json:"unit" db:"unit" example:"g"`
}

type AppointmentJSON struct {
	Id                int               `json:"id"`
	StartingDate      string            `json:"starting_date" example:"2022-10-19T10:00:00"`
	EndingDate        string            `json:"ending_date" example:"2022-10-20T10:00:00"`
	Length            int64             `json:"length,omitempty" example:"2"`
	Anamnesis         string            `json:"anamnesis" example:"example"`
	Status            string            `json:"status,omitempty" example:"example"`
	Treatment         string            `json:"treatment" example:"example"`
	Arrived           bool              `json:"arrived" example:"true"`
	AppointmentTypeId int               `json:"appointment_type_id" example:"1"`
	StaffId           int               `json:"staff_id" example:"1"`
	Billed            bool              `json:"billed" example:"false"`
	Examinations      []ExaminationJSON `json:"examinations"`
	Operations        []ExaminationJSON `json:"operations"`
	Diagnosis         []DiagnosedJSON   `json:"diagnosis"`
	Useds             []UsedJSON        `json:"useds"`
	Prescriptions     []PrescribedJSON  `json:"prescriptions"`
}

type AddAppointmentDB struct {
	Id                int            `json:"id"`
	StartingDate      string         `json:"starting_date" db:"starting_date" example:"2022-10-19T10:00:00"`
	EndingDate        sql.NullString `json:"ending_date" db:"ending_date" `
	Length            int64          `json:"length,omitempty" example:"3"`
	Anamnesis         sql.NullString `json:"anamnesis"`
	Status            sql.NullString `json:"status,omitempty"`
	Treatment         sql.NullString `json:"treatment"`
	Arrived           bool           `json:"arrived" example:"true"`
	AppointmentTypeId int            `json:"appointment_type_id" db:"appointment_type_id" example:"1"`
	StaffId           int            `json:"staff_id" db:"staff_id" example:"1"`
	Billed            bool           `json:"billed" db:"billed" example:"false"`
}

type AppointmentDB struct {
	Id                int            `json:"id"`
	StartingDate      string         `json:"starting_date" db:"starting_date" example:"2022-10-19T10:00:00"`
	EndingDate        sql.NullString `json:"ending_date" db:"ending_date" `
	Length            int64          `json:"length,omitempty" example:"3"`
	Anamnesis         sql.NullString `json:"anamnesis"`
	Status            sql.NullString `json:"status,omitempty"`
	Treatment         sql.NullString `json:"treatment"`
	Arrived           bool           `json:"arrived" example:"true"`
	AppointmentTypeId int            `json:"appointment_type_id" db:"appointment_type_id" example:"1"`
	StaffId           int            `json:"staff_id" db:"staff_id" example:"1"`
	Billed            bool           `json:"billed" db:"billed" example:"false"`
	CustomerId        int            `json:"customer_id" db:"customer_id" example:"1"`
	PatientId         int            `json:"patient_id" db:"patient_id" example:"1"`
	Name              string         `json:"name" db:"name" example:"musti"`
	DateOfBirth       sql.NullString `json:"date_of_birth" db:"date_of_birth"`
	Sex               string         `json:"sex" db:"sex" example:"male"`
}

type GetAppointmentDB struct {
	AppointmentDB
	Examinations  []GetExamination `json:"examinations"`
	Operations    []GetExamination `json:"operations"`
	Diagnosis     []GetDiagnosed   `json:"diagnosis"`
	Useds         []GetUsed        `json:"useds"`
	Prescriptions []GetPrescribed  `json:"prescriptions"`
}

type AsPatientDB struct {
	PatientId     int `db:"patient_id"`
	AppointmentId int `db:"appointment_id"`
}

type AppointmentAddJSON struct {
	StartingDate      string            `json:"starting_date" example:"2022-10-19T10:00:00"`
	EndingDate        string            `json:"ending_date" example:"2022-10-21T10:00:00"`
	Length            int64             `json:"length" example:"2"`
	Anamnesis         string            `json:"anamnesis" example:"example"`
	Status            string            `json:"status" example:"example"`
	Treatment         string            `json:"treatment" example:"example"`
	Arrived           bool              `json:"arrived" example:"true"`
	AppointmentTypeId int               `json:"appointment_type_id" example:"1"`
	StaffId           int               `json:"staff_id" example:"1"`
	Billed            bool              `json:"billed" example:"false"`
	Examinations      []ExaminationJSON `json:"examinations"`
	Operations        []ExaminationJSON `json:"operations"`
	Diagnosis         []DiagnosedJSON   `json:"diagnosis"`
	Useds             []UsedJSON        `json:"useds"`
	Prescriptions     []PrescribedJSON  `json:"prescriptions"`
}

/* type AppointmentModifyJSON struct {
	Id 					int   `json:"id"`
	StartingDate 		string `json:"starting_date" example:"2022-10-19T10:00:00"`
	EndingDate 			string `json:"ending_date" example:"2022-10-20T10:00:00"`
	Length				int64 `json:"length,omitempty" example:"2"`
	Anamnesis 			string `json:"anamnesis" example:"example"`
	Status				string `json:"status,omitempty" example:"example"`
	Treatment			string `json:"treatment" example:"example"`
	Arrived				bool `json:"arrived" example:"true"`
	AppointmentTypeId	int `json:"appointment_type_id" example:"1"`
	StaffId				int `json:"staff_id" example:"1"`
} */

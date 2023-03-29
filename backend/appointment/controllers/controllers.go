package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	//"fmt"

	_ "app/docs"
)

const SecretKey = "secret"


// AddAppointment func for add new appointment to database.
// @Description Insert new appointment to the appointment table in Huovet schema.
// @Summary Add new appointment to database
// @Tags Appointment
// @Accept json
// @Produce json
// @Param request body models.AppointmentAddJSON true "query body"
// @Success 200 {object} models.AddResponse "Add success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointment/addAppointment/{patientId} [post]
func AddAppointment(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	patientId, err := c.ParamsInt("patientId")

	var data models.AppointmentJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	appointment := models.AddAppointmentDB{
		StartingDate:		data.StartingDate,
		EndingDate:			utils.NewNullString(data.EndingDate),
		Length:				data.Length,
		Anamnesis:			utils.NewNullString(data.Anamnesis),
		Status:				utils.NewNullString(data.Status),
		Treatment:			utils.NewNullString(data.Treatment),
		Arrived:			data.Arrived,
		AppointmentTypeId:	data.AppointmentTypeId,
		StaffId:			data.StaffId,
		Billed:				false,
	}

	database.Database.Table("appointment").Create(&appointment)

	asPatient := models.AsPatientDB{
		PatientId: patientId,
		AppointmentId: appointment.Id,
	}

	database.Database.Table("as_patient").Create(&asPatient)

	examinations := []models.ExaminationDB{}

	for _, e := range data.Examinations {
		examinations = append(examinations, models.ExaminationDB{
			ExaminationTypeId: 	e.ExaminationTypeId,
			PatientId: 			patientId,
			AppointmentId: 		appointment.Id,
			Result: 			e.Result,
		})
	}

	database.Database.Table("examination").Create(&examinations)

	operations := []models.ExaminationDB{}
	for _, o := range data.Operations {
		operations = append(operations, models.ExaminationDB{
			ExaminationTypeId: 	o.ExaminationTypeId,
			PatientId: 			patientId,
			AppointmentId: 		appointment.Id,
			Result: 			o.Result,
		})
	}

	database.Database.Table("examination").Create(&operations)

	diagnosis := []models.DiagnosedDB{}

	for _, d := range data.Diagnosis {
		diagnosis = append(diagnosis, models.DiagnosedDB{
			DiagnosisId: 	d.DiagnosisId,
			PatientId: 		patientId,
			AppointmentId: 	appointment.Id,
			InfoText:		d.InfoText,
		})
	}

	database.Database.Table("diagnosed").Create(&diagnosis)

	useds := []models.UsedDB{}

	for _, u := range data.Useds {
		useds = append(useds, models.UsedDB{
			SuppliesId: 	u.SuppliesId,
			PatientId: 		patientId,
			AppointmentId: 	appointment.Id,
			Amount: 		u.Amount,
		})
	}

	database.Database.Table("used").Create(&useds)

	prescriptions := []models.PrescribedDB{}

	for _, p := range data.Prescriptions {
		prescriptions = append(prescriptions, models.PrescribedDB{
			MedicineId: 	p.MedicineId,
			PatientId: 		patientId,
			AppointmentId: 	appointment.Id,
			Dosage: 		p.Dosage,
			Amount: 		p.Amount,
		})
	}

	database.Database.Table("prescribed").Create(&prescriptions)
	
	return c.JSON(fiber.Map{
		"message": "add success",
	})
}


// GetAppointment func for return appointment information.
// @Description Return the information of the appointment.
// @Summary Return appointment information
// @Tags Appointment
// @Accept json
// @Produce json
// @Param id path int true "Appointment ID"
// @Success 200 {object} models.GetAppointmentDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointment/getAppointment/{id} [get]
func GetAppointment(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")


	appointment := models.AppointmentDB{}

	if err = database.Database.Table("appointment").Select(
			`appointment.id, appointment.starting_date, appointment.ending_date, appointment.length, appointment.arrived,
			appointment.appointment_type_id, appointment.anamnesis, appointment.status, appointment.treatment, appointment.staff_id,
			appointment.billed, patient.id as patient_id, patient.customer_id, patient.name, patient.date_of_birth, patient.sex`,
		).Joins(
			"JOIN as_patient ON appointment.id = as_patient.appointment_id",
		).Joins(
			"JOIN patient ON patient.id = as_patient.patient_id",
		).Where("appointment.id = ?", id).First(&appointment).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "searching fail",
			})
	}

	examinations := []models.GetExamination{}
	if err = database.Database.Table("examination").Select(
			"examination.examination_type_id, examination.result, examination_type.name, examination_type.category, examination_type.price, examination_type.location",
		).Joins(
			"JOIN examination_type ON examination_type.id = examination.examination_type_id",
		).Where("examination.appointment_id = ? AND examination_type.category = ?", id, "examination").Find(&examinations).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	operations := []models.GetExamination{}
	if err = database.Database.Table("examination").Select(
			"examination.examination_type_id, examination.result, examination_type.name, examination_type.category, examination_type.price, examination_type.location",
		).Joins(
			"JOIN examination_type ON examination_type.id = examination.examination_type_id",
		).Where("examination.appointment_id = ? AND examination_type.category = ?", id, "operation").Find(&operations).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	diagnosis := []models.GetDiagnosed{}
	if err = database.Database.Table("diagnosed").Select(
		"diagnosed.diagnosis_id, diagnosed.info_text, diagnosis.name, diagnosis.code",
	).Joins(
		"JOIN diagnosis ON diagnosis.id = diagnosed.diagnosis_id",
	).Where("diagnosed.appointment_id = ?", id).Find(&diagnosis).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	useds := []models.GetUsed{}
	if err = database.Database.Table("used").Select(
		"used.supplies_id, used.amount, supplies.name, supplies.type, supplies.unit, supplies.price",
	).Joins(
		"JOIN supplies ON supplies.id = used.supplies_id",
	).Where("appointment_id = ?", id).Find(&useds).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	prescriptions := []models.GetPrescribed{}
	if err = database.Database.Table("prescribed").Select(
		"prescribed.medicine_id, prescribed.dosage, prescribed.amount, medicine.name, medicine.unit",
	).Joins(
		"JOIN medicine ON medicine.id = prescribed.medicine_id",
	).Where("appointment_id = ?", id).Find(&prescriptions).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	resultAppointment := models.GetAppointmentDB{
		AppointmentDB:	appointment,
		Examinations:	examinations,
		Operations:		operations,
		Diagnosis:		diagnosis,
		Useds: 			useds,
		Prescriptions:	prescriptions,
	}

	return c.JSON(resultAppointment)
}


// DeleteAppointment func for remove appointment from database.
// @Description Remove all the information of the appointment.
// @Summary Delete appointment information
// @Tags Appointment
// @Accept json
// @Produce json
// @Param id path int true "Appointment ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointment/deleteAppointment/{id}  [delete]
func DeleteAppointment(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")

	asPatient := models.AsPatientDB{}
	if err = database.Database.Table("as_patient").Where("appointment_id = ?", id).Delete(&asPatient).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	deleteOtherTables(id)

	appointment := models.AddAppointmentDB{}
	if err = database.Database.Table("appointment").Delete(&appointment, id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyAppointment func for update appointment information.
// @Description Update the information of the appointment.
// @Summary Update appointment information
// @Tags Appointment
// @Accept json
// @Produce json
// @Param request body models.AppointmentJSON true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 400  {object}  models.AlreadyBilledResponse "appointment is already billed"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointment/modifyAppointment [put]
func ModifyAppointment(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.AppointmentJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	appointment := models.AddAppointmentDB{}
	if err = database.Database.Table("appointment").First(&appointment, data.Id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}
	
	if appointment.Billed == true {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "appointment is already billed",
		})
	} else {
		database.Database.Table("appointment").Where("id = ? AND billed = ?", data.Id, false).Updates(map[string]interface{}{
			"id":					data.Id,
			"starting_date":		data.StartingDate,
			"ending_date":			utils.NewNullString(data.EndingDate),
			"length":				data.Length,
			"anamnesis":			utils.NewNullString(data.Anamnesis),
			"status":				utils.NewNullString(data.Status),
			"treatment":			utils.NewNullString(data.Treatment),
			"arrived":				data.Arrived,
			"appointment_type_id":	data.AppointmentTypeId,
			"staff_id":				data.StaffId,
			"billed":				false,
		})
	
		deleteOtherTables(data.Id)

		var patientIds []int
		database.Database.Table("as_patient").Where("appointment_id = ?", data.Id).Pluck("patient_id", &patientIds)
		
		patientId := patientIds[0]

		examinations := []models.ExaminationDB{}

		for _, e := range data.Examinations {
			examinations = append(examinations, models.ExaminationDB{
				ExaminationTypeId: 	e.ExaminationTypeId,
				PatientId: 			patientId,
				AppointmentId: 		data.Id,
				Result: 			e.Result,
			})
		}

		database.Database.Table("examination").Create(&examinations)

		operations := []models.ExaminationDB{}
		for _, o := range data.Operations {
			operations = append(operations, models.ExaminationDB{
				ExaminationTypeId: 	o.ExaminationTypeId,
				PatientId: 			patientId,
				AppointmentId: 		data.Id,
				Result: 			o.Result,
			})
		}

		database.Database.Table("examination").Create(&operations)

		diagnosis := []models.DiagnosedDB{}

		for _, d := range data.Diagnosis {
			diagnosis = append(diagnosis, models.DiagnosedDB{
				DiagnosisId: 	d.DiagnosisId,
				PatientId: 		patientId,
				AppointmentId: 	data.Id,
				InfoText:		d.InfoText,
			})
		}

		database.Database.Table("diagnosed").Create(&diagnosis)

		useds := []models.UsedDB{}

		for _, u := range data.Useds {
			useds = append(useds, models.UsedDB{
				SuppliesId: 	u.SuppliesId,
				PatientId: 		patientId,
				AppointmentId: 	data.Id,
				Amount: 		u.Amount,
			})
		}

		database.Database.Table("used").Create(&useds)

		prescriptions := []models.PrescribedDB{}

		for _, p := range data.Prescriptions {
			prescriptions = append(prescriptions, models.PrescribedDB{
				MedicineId: 	p.MedicineId,
				PatientId: 		patientId,
				AppointmentId: 	data.Id,
				Dosage: 		p.Dosage,
				Amount: 		p.Amount,
			})
		}

		database.Database.Table("prescribed").Create(&prescriptions)

		return c.JSON(fiber.Map{
			"message": "update success",
		})
	}

}


// ListAllAppointment func for return information of all appointments.
// @Description Return the information of all appointments.
// @Summary Return array of all appointments information
// @Tags Appointment
// @Accept json
// @Produce json
// @Success 200 {object} []models.AppointmentDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointment/listAllAppointment [get]
func ListAllAppointment(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	appointments := []models.AppointmentDB{}
	if err = database.Database.Table("appointment").Select(
			`appointment.id, appointment.starting_date, appointment.ending_date, appointment.length, appointment.arrived, 
			appointment.appointment_type_id, appointment.anamnesis, appointment.status, appointment.treatment, appointment.staff_id, 
			appointment.billed, patient.id as patient_id, patient.customer_id, patient.name, patient.date_of_birth, patient.sex`,
		).Joins(
			"JOIN as_patient ON appointment.id = as_patient.appointment_id",
		).Joins(
			"JOIN patient ON patient.id = as_patient.patient_id",
		).Find(&appointments).Error; err != nil {
			return c.JSON(fiber.Map{
				"message": "searching fail",
			})
	}


	return c.JSON(appointments)
}


// CustomerAppointments func for return all appointment of customer.
// @Description Return the information of customer all appointments.
// @Summary Return customer all appointments information
// @Tags Appointment
// @Accept json
// @Produce json
// @Param customerId path int true "Customer ID"
// @Success 200 {object} []models.AppointmentDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointment/customerAppointments/{customerId} [get]
func CustomerAppointments(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	customerId, err := c.ParamsInt("customerId")

	appointments := []models.AppointmentDB{}
	database.Database.Table("appointment").Select(
			`appointment.id, appointment.starting_date, appointment.ending_date, appointment.length, appointment.arrived,
			appointment.appointment_type_id, appointment.anamnesis, appointment.status, appointment.treatment, appointment.staff_id,
			appointment.billed, patient.id as patient_id, patient.customer_id, patient.name, patient.date_of_birth, patient.sex`,
		).Joins(
			"JOIN as_patient ON appointment.id = as_patient.appointment_id",
		).Joins(
			"JOIN patient ON patient.id = as_patient.patient_id",
		).Where("patient.customer_id = ?", customerId).Find(&appointments)

	return c.JSON(appointments)
}



// BilledAppointment func for update appointment billed field to true.
// @Description Update the billed field to true.
// @Summary Update appointment billed field to true
// @Tags Appointment
// @Accept json
// @Produce json
// @Param id path int true "Appointment ID"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointment/billedAppointment/{id} [put]
func BilledAppointment(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")

	database.Database.Table("appointment").Where("id = ?", id).Update("billed", true)
	
	return c.JSON(fiber.Map{
		"message": "update success",
	})
}


func deleteOtherTables(id int) {

	examinations:= models.ExaminationDB{}
	database.Database.Table("examination").Where("appointment_id = ?", id).Delete(&examinations)

	diagnosis := models.DiagnosedDB{}
	database.Database.Table("diagnosed").Where("appointment_id = ?", id).Delete(&diagnosis)

	used := models.UsedDB{}
	database.Database.Table("used").Where("appointment_id = ?", id).Delete(&used)

	prescribed := models.PrescribedDB{}
	database.Database.Table("prescribed").Where("appointment_id = ?", id).Delete(&prescribed)
}
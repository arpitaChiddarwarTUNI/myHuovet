package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"


// AddBill func for add new bill to database.
// @Description Insert new bill to the billing table in Huovet schema.
// @Summary Add new bill to database
// @Tags Billing
// @Accept json
// @Produce json
// @Param request body models.BillAddJSON true "query body"
// @Success 200 {object} models.Bill
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /billing/addBill [post]
func AddBill(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var addBill models.BillAddJSON

	if err := c.BodyParser(&addBill); err != nil {
		return err
	}

	bill := models.BillDB{
		AppointmentId: 		addBill.AppointmentId,
		DueDate: 			addBill.DueDate,
		Paid: 				addBill.Paid,
		ServicePrice: 		addBill.ServicePrice,
	}

	if err = database.Database.Table("billing").Create(&bill).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "add fail",
		})
	}

	for _, supply := range addBill.Supplies {
		database.Database.Table("used").Where("supplies_id = ? AND appointment_id = ?", supply.SuppliesId , addBill.AppointmentId).Updates(map[string]interface{}{"price": supply.Price})
	}

	for _, examination := range addBill.Examinations {
		database.Database.Table("examination").Where("examination_type_id = ? AND appointment_id = ?", examination.ExaminationTypeId , addBill.AppointmentId).Updates(map[string]interface{}{"price": examination.Price})
	}

	return c.JSON(bill)
}



// DeleteBill func for remove bill from database.
// @Description Remove all the information of the bill.
// @Summary Delete bill information
// @Tags Billing
// @Accept json
// @Produce json
// @Param appointment_id path int true "Appointment ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /billing/deleteBill/{appointment_id}  [delete]
func DeleteBill(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	appointmentId, err := c.ParamsInt("appointment_id")

	bill := models.BillDB{}
	if err = database.Database.Table("billing").Delete(&bill, "appointment_id = ?", appointmentId).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyBill func for update bill information.
// @Description Update the information of the bill.
// @Summary Update bill information
// @Tags Billing
// @Accept json
// @Produce json
// @Param request body models.Bill true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /billing/modifyBill [put]
func ModifyBill(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.Bill

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("billing").Where("bill_number = ?", data.BillNumber).Updates(models.BillDB{
		BillNumber:			data.BillNumber,
		AppointmentId: 		data.AppointmentId,
		DueDate: 			data.DueDate,
		Paid: 				data.Paid,
		ServicePrice: 		data.ServicePrice,
	})

	for _, supply := range data.Supplies {
		database.Database.Table("used").Where("supplies_id = ? AND appointment_id = ?", supply.SuppliesId, data.AppointmentId).Updates(map[string]interface{}{"price": supply.Price})
	}

	for _, examination := range data.Examinations {
		database.Database.Table("examination").Where("examination_type_id = ? AND appointment_id = ?", examination.ExaminationTypeId, data.AppointmentId).Updates(map[string]interface{}{"price": examination.Price})
	}

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}


// GetBill func for get bill information.
// @Description Get the information of the bill.
// @Summary Get bill information
// @Tags Billing
// @Accept json
// @Produce json
// @Param appointment_id path int true "Appointment ID"
// @Success 200 {object} []models.Bill "Search success"
// @Failure 400  {object}  models.SearchFailResponse "searching fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /billing/getBill/{appointment_id} [get]
func GetBill(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	appointmentId, err := c.ParamsInt("appointment_id")
	var data models.BillDB

	if err = database.Database.Table("billing").Where("appointment_id = ?", appointmentId).First(&data).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	supplies := []models.GetSupply{}
	/* if err = database.Database.Table("used").Select(
		"supplies_id, amount, price",
	).Where("appointment_id = ?", data.AppointmentId).Find(&supplies).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	} */

	if err = database.Database.Table("used").Select(
		"used.supplies_id, used.amount, supplies.name, used.price",
	).Joins(
		"JOIN supplies ON supplies.id = used.supplies_id",
	).Where("used.appointment_id = ?", data.AppointmentId).Find(&supplies).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	examinations := []models.GetExamination{}
	/* if err = database.Database.Table("examination").Select(
		"examination_type_id, price",
	).Where("appointment_id = ?", data.AppointmentId).Find(&examinations).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	} */

	if err = database.Database.Table("examination").Select(
		"examination.examination_type_id, examination_type.name, examination.price",
	).Joins(
		"JOIN examination_type ON examination_type.id = examination.examination_type_id",
	).Where("examination.appointment_id = ?", data.AppointmentId).Find(&examinations).Error; err != nil {
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "searching fail",
	})
}

	bill := models.Bill{
		BillNumber:		data.BillNumber,
		AppointmentId:	data.AppointmentId,
		DueDate:		data.DueDate,
		Paid:			data.Paid,
		ServicePrice:	data.ServicePrice,
		Supplies:		supplies,
		Examinations:	examinations,
	}

	return c.JSON(bill)
}
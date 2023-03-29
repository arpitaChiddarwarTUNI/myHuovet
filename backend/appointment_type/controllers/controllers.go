package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"


// AddAppointmentType func for add new appointmentType to database.
// @Description Insert new appointmentType to the supplies table in Huovet schema.
// @Summary Add new appointmentType to database
// @Tags AppointmentType
// @Accept json
// @Produce json
// @Param request body models.AppointmentTypeAddJSON true "query body"
// @Success 200 {object} models.AppointmentType
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointmentType/addAppointmentType [post]
func AddAppointmentType(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var appointmentType models.AppointmentType

	if err := c.BodyParser(&appointmentType); err != nil {
		return err
	}

	database.Database.Table("appointment_type").Create(&appointmentType)
	
	return c.JSON(appointmentType)
}



// DeleteAppointmentType func for remove appointmentType from database.
// @Description Remove all the information of the appointmentType.
// @Summary Delete appointmentType information
// @Tags AppointmentType
// @Accept json
// @Produce json
// @Param id path int true "AppointmentType ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointmentType/deleteAppointmentType/{id}  [delete]
func DeleteAppointmentType(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")

	appointmentType := models.AppointmentType{}
	if err = database.Database.Table("appointment_type").Delete(&appointmentType, id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyAppointmentType func for update appointmentType information.
// @Description Update the information of the appointmentType.
// @Summary Update appointmentType information
// @Tags AppointmentType
// @Accept json
// @Produce json
// @Param request body models.AppointmentType true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointmentType/modifyAppointmentType [put]
func ModifyAppointmentType(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.AppointmentType

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("appointment_type").Where("id = ?", data.Id).Updates(data)

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}

// GetAllAppointmentType func for get all appointmentType information.
// @Description Get all the information of the appointmentTypes.
// @Summary Get all appointmentType information
// @Tags AppointmentType
// @Accept json
// @Produce json
// @Success 200  {object}  []models.AppointmentType "Search success"
// @Failure 400  {object}  models.SearchFailResponse "searching fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /appointmentType/getAllAppointmentType [get]
func GetAllAppointmentType(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data []models.AppointmentType

	if err = database.Database.Table("appointment_type").Find(&data).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(data)
}
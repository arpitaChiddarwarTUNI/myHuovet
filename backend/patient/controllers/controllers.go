package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"


// AddPatient func for add new patient to database.
// @Description Insert new patient to the patient table in Huovet schema.
// @Summary Add new patient to database
// @Tags Patient
// @Accept json
// @Produce json
// @Param request body models.PatientAddJSON true "query body"
// @Success 200 {object} models.PatientDB
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /patient/addPatient [post]
func AddPatient(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.PatientJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	patient := models.PatientDB{
		Id:				data.Id,
		Name:			data.Name,
		Sex:			data.Sex,
		Weight:			utils.NewNullInt64(data.Weight),
		Microchip:		utils.NewNullString(data.Microchip),
		DateOfBirth:	utils.NewNullString(data.DateOfBirth),
		CustomerId:		data.CustomerId,
		BreedId:		data.BreedId,
	}

	database.Database.Table("patient").Create(&patient)
	
	return c.JSON(patient)
}


// GetPatient func for return patient information.
// @Description Return the information of the patient.
// @Summary Return patient information
// @Tags Patient
// @Accept json
// @Produce json
// @Param id path int true "Patient ID"
// @Success 200 {object} models.PatientDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /patient/getPatient/{id} [get]
func GetPatient(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")


	patient := models.PatientDB{}
	if err = database.Database.Table("patient").First(&patient, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(patient)
}


// DeletePatient func for remove patient from database.
// @Description Remove all the information of the patient.
// @Summary Delete patient information
// @Tags Patient
// @Accept json
// @Produce json
// @Param id path int true "Patient ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /patient/deletePatient/{id}  [delete]
func DeletePatient(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")

	patient := models.PatientDB{}
	if err = database.Database.Table("patient").Delete(&patient, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyPatient func for update patient information.
// @Description Update the information of the patient.
// @Summary Update patient information
// @Tags Patient
// @Accept json
// @Produce json
// @Param request body models.PatientJSON true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /patient/modifyPatient [put]
func ModifyPatient(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.PatientJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("patient").Where("id = ?", data.Id).Updates(map[string]interface{}{
		"id": data.Id,
		"name":	data.Name,
		"sex": data.Sex,
		"weight": utils.NewNullInt64(data.Weight),
		"microchip": utils.NewNullString(data.Microchip),
		"date_of_birth": utils.NewNullString(data.DateOfBirth),
		"customer_id": data.CustomerId,
		"breed_id": data.BreedId,
	})

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}
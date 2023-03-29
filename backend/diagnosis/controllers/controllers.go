package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"

// AddDiagnosis func for add new Diagnosis to database.
// @Description Insert new Diagnosis to the Diagnosis table in Huovet schema.
// @Summary Add new Diagnosis to database
// @Tags Diagnosis
// @Accept json
// @Produce json
// @Param request body models.DiagnosisAddJSON true "query body"
// @Success 200 {object} models.DiagnosisJSON
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /diagnosis/addDiagnosis [post]
func AddDiagnosis(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.DiagnosisJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	diagnosis := models.DiagnosisDB{
		Id:   data.Id,
		Name: data.Name,
		Code: utils.NewNullString(data.Code),
	}

	database.Database.Table("diagnosis").Create(&diagnosis)

	if diagnosis.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{

			"message": "name already exist",
		})
	}
	return c.JSON(diagnosis)
}

// GetDiagnosis func for return Diagnosis information.
// @Description Return the information of the Diagnosis.
// @Summary Return Diagnosis information
// @Tags Diagnosis
// @Accept json
// @Produce json
// @Param id path int true "Diagnosis ID"
// @Success 200 {object} models.DiagnosisDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /diagnosis/getDiagnosis/{id} [get]
func GetDiagnosis(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	diagnosis := models.DiagnosisDB{}
	if err = database.Database.Table("diagnosis").First(&diagnosis, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(diagnosis)
}

// DeleteDiagnosis func for remove Diagnosis from database.
// @Description Remove all the information of the Diagnosis.
// @Summary Delete Diagnosis information
// @Tags Diagnosis
// @Accept json
// @Produce json
// @Param id path int true "Diagnosis ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /diagnosis/deleteDiagnosis/{id}  [delete]
func DeleteDiagnosis(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	diagnosis := models.DiagnosisDB{}
	if err = database.Database.Table("diagnosis").Delete(&diagnosis, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyDiagnosis func for update Diagnosis information.
// @Description Update the information of the Diagnosis.
// @Summary Update Diagnosis information
// @Tags Diagnosis
// @Accept json
// @Produce json
// @Param request body models.DiagnosisJSON true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /diagnosis/modifyDiagnosis [put]
func ModifyDiagnosis(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.DiagnosisJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("diagnosis").Where("id = ?", data.Id).Updates(map[string]interface{}{
		"id":   data.Id,
		"name": data.Name,
		"code": utils.NewNullString(data.Code),
	})

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}

// GetDiagnosis func for return all Diagnosis and breed.
// @Description Return the all Diagnosis and releated breeds
// @Summary Returns all Diagnosis
// @Tags Diagnosis
// @Accept json
// @Produce json
// @Success 200 {object} models.DiagnosisDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /diagnosis/getAllDiagnosis/ [get]
func GetAllDiagnosis(c *fiber.Ctx) error {
	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	diagnosis := []models.DiagnosisDB{}
	if err = database.Database.Table("diagnosis").Order("id").Find(&diagnosis).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	if len(diagnosis) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no Diagnosis in database",
		})

	}

	return c.JSON(diagnosis)
}

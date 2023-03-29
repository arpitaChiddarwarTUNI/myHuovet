package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"

// AddExaminationtype func for add new Examinationtype to database.
// @Description Insert new Examinationtype to the Examinationtype table in Huovet schema.
// @Summary Add new Examinationtype to database
// @Tags Examinationtype
// @Accept json
// @Produce json
// @Param request body models.ExaminationtypeAddJSON true "query body"
// @Success 200 {object} models.ExaminationtypeDB
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /examinationtype/addExaminationtype [post]
func AddExaminationtype(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.ExaminationtypeDB

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	examinationtype := models.ExaminationtypeDB{
		Id:       data.Id,
		Name:     data.Name,
		Category: data.Category,
		Price:    data.Price,
		Location: data.Location,
	}

	database.Database.Table("examination_type").Create(&examinationtype)

	if examinationtype.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{

			"message": "name already exist",
		})
	}
	return c.JSON(examinationtype)
}

// GetExaminationtype func for return Examinationtype information.
// @Description Return the information of the Examinationtype.
// @Summary Return Examinationtype information
// @Tags Examinationtype
// @Accept json
// @Produce json
// @Param id path int true "Examinationtype ID"
// @Success 200 {object} models.ExaminationtypeDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /examinationtype/getExaminationtype/{id} [get]
func GetExaminationtype(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	examinationtype := models.ExaminationtypeDB{}
	if err = database.Database.Table("examination_type").First(&examinationtype, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(examinationtype)
}

// DeleteExaminationtype func for remove Examinationtype from database.
// @Description Remove all the information of the Examinationtype.
// @Summary Delete Examinationtype information
// @Tags Examinationtype
// @Accept json
// @Produce json
// @Param id path int true "Examinationtype ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /examinationtype/deleteExaminationtype/{id}  [delete]
func DeleteExaminationtype(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	examinationtype := models.ExaminationtypeDB{}
	if err = database.Database.Table("examination_type").Delete(&examinationtype, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyExaminationtype func for update Examinationtype information.
// @Description Update the information of the Examinationtype.
// @Summary Update Examinationtype information
// @Tags Examinationtype
// @Accept json
// @Produce json
// @Param request body models.ExaminationtypeDB true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /examinationtype/modifyExaminationtype [put]
func ModifyExaminationtype(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.ExaminationtypeDB

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("examination_type").Where("id = ?", data.Id).Updates(map[string]interface{}{
		"id":       data.Id,
		"name":     data.Name,
		"category": data.Category,
		"price":    data.Price,
		"location": data.Location,
	})

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}

// GetExaminationtype func for return all Examinationtype and breed.
// @Description Return the all Examinationtype and releated breeds
// @Summary Returns all Examinationtype
// @Tags Examinationtype
// @Accept json
// @Produce json
// @Success 200 {object} models.ExaminationtypeDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /examinationtype/getAllExaminationtype/ [get]
func GetAllExaminationtype(c *fiber.Ctx) error {
	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	examinationtype := []models.ExaminationtypeDB{}
	if err = database.Database.Table("examination_type").Order("id").Find(&examinationtype).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	if len(examinationtype) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no Examinationtype in database",
		})

	}

	return c.JSON(examinationtype)
}

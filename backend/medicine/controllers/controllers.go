package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"

// AddMedicine func for add new Medicine to database.
// @Description Insert new Medicine to the Medicine table in Huovet schema.
// @Summary Add new Medicine to database
// @Tags Medicine
// @Accept json
// @Produce json
// @Param request body models.MedicineAddJSON true "query body"
// @Success 200 {object} models.MedicineJSON
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /medicine/addMedicine [post]
func AddMedicine(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.MedicineJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	medicine := models.MedicineDB{
		Id:              data.Id,
		Name:            data.Name,
		Unit:            data.Unit,
		ActiveSubstance: data.ActiveSubstance,
		Strength:        data.Strength,
	}

	database.Database.Table("medicine").Create(&medicine)

	if medicine.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{

			"message": "name already exist",
		})
	}
	return c.JSON(medicine)
}

// GetMedicine func for return Medicine information.
// @Description Return the information of the Medicine.
// @Summary Return Medicine information
// @Tags Medicine
// @Accept json
// @Produce json
// @Param id path int true "Medicine ID"
// @Success 200 {object} models.MedicineDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /medicine/getMedicine/{id} [get]
func GetMedicine(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	medicine := models.MedicineDB{}
	if err = database.Database.Table("medicine").First(&medicine, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(medicine)
}

// DeleteMedicine func for remove Medicine from database.
// @Description Remove all the information of the Medicine.
// @Summary Delete Medicine information
// @Tags Medicine
// @Accept json
// @Produce json
// @Param id path int true "Medicine ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /medicine/deleteMedicine/{id}  [delete]
func DeleteMedicine(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	medicine := models.MedicineDB{}
	if err = database.Database.Table("medicine").Delete(&medicine, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyMedicine func for update Medicine information.
// @Description Update the information of the Medicine.
// @Summary Update Medicine information
// @Tags Medicine
// @Accept json
// @Produce json
// @Param request body models.MedicineJSON true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /medicine/modifyMedicine [put]
func ModifyMedicine(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.MedicineJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("medicine").Where("id = ?", data.Id).Updates(map[string]interface{}{
		"id":               data.Id,
		"name":             data.Name,
		"unit":             data.Unit,
		"active_substance": data.ActiveSubstance,
		"strength":         data.Strength,
	})
	return c.JSON(fiber.Map{
		"message": "update success",
	})
}

// GetMedicine func for return all Medicine and breed.
// @Description Return the all Medicine and releated breeds
// @Summary Returns all Medicine
// @Tags Medicine
// @Accept json
// @Produce json
// @Success 200 {object} models.MedicineDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /medicine/getAllMedicine/ [get]
func GetAllMedicine(c *fiber.Ctx) error {
	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	medicine := []models.MedicineDB{}
	if err = database.Database.Table("medicine").Order("id").Find(&medicine).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	if len(medicine) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no Medicine in database",
		})

	}

	return c.JSON(medicine)
}

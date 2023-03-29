package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"


// AddSupply func for add new supply to database.
// @Description Insert new supply to the supplies table in Huovet schema.
// @Summary Add new supply to database
// @Tags Supply
// @Accept json
// @Produce json
// @Param request body models.SupplyAddJSON true "query body"
// @Success 200 {object} models.Supply
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /supply/addSupply [post]
func AddSupply(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var supply models.Supply

	if err := c.BodyParser(&supply); err != nil {
		return err
	}

	database.Database.Table("supplies").Create(&supply)
	
	return c.JSON(supply)
}



// DeleteSupply func for remove supply from database.
// @Description Remove all the information of the supply.
// @Summary Delete supply information
// @Tags Supply
// @Accept json
// @Produce json
// @Param id path int true "Supply ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /supply/deleteSupply/{id}  [delete]
func DeleteSupply(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")

	supply := models.Supply{}
	if err = database.Database.Table("supplies").Delete(&supply, id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifySupply func for update supply information.
// @Description Update the information of the supply.
// @Summary Update supply information
// @Tags Supply
// @Accept json
// @Produce json
// @Param request body models.Supply true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /supply/modifySupply [put]
func ModifySupply(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.Supply

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("supplies").Where("id = ?", data.Id).Updates(data)

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}


// GetAllSupplies func for get all supplies information.
// @Description Get all the information of the supplies.
// @Summary Get all supplies information
// @Tags Supply
// @Accept json
// @Produce json
// @Success 200 {object} []models.Supply "Search success"
// @Failure 400  {object}  models.SearchFailResponse "searching fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /supply/getAllSupplies [get]
func GetAllSupplies(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data []models.Supply

	if err = database.Database.Table("supplies").Find(&data).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(data)
}
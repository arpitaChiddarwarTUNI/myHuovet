package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

// AddBreed func for add new breed to database.
// @Description Insert new breed to the breed table in Huovet schema.
// @Summary Add new breed to database
// @Tags breed
// @Accept json
// @Produce json
// @Param request body models.BreedBodyJSON true "query body"
// @Success 200 {object} models.BreedDB
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /breed/addBreed [post]
func AddBreed(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.BreedBodyJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	breed := models.BreedDB{
		Name:          data.Name,
		AverageWeight: utils.NewNullInt64(int64(data.AverageWeight)),
		SpeciesId:     data.SpeciesId,
	}

	database.Database.Table("breed").Create(&breed)
	if breed.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "breed already exist",
		})
	}
	return c.JSON(breed)
}

// GetBreed func for return breed information.
// @Description Return the information of the breed.
// @Summary Return breed information
// @Tags breed
// @Accept json
// @Produce json
// @Param id path int true "breed ID"
// @Success 200 {object} models.BreedDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /breed/getBreed/{id} [get]
func GetBreed(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	breed := models.BreedDB{}
	if err = database.Database.Table("breed").First(&breed, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(breed)
}

// DeleteBreed func for remove breed from database.
// @Description Remove all the information of the breed.
// @Summary Delete breed information
// @Tags breed
// @Accept json
// @Produce json
// @Param id path int true "Breed ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /breed/deleteBreed/{id}  [delete]
func DeleteBreed(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	breed := models.BreedDB{}
	if err = database.Database.Table("breed").Delete(&breed, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyBreed func for update breed information.
// @Description Update the information of the breed.
// @Summary Update breed information
// @Tags breed
// @Accept json
// @Produce json
// @Param request body models.BreedJSON true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /breed/modifyBreed [put]
func ModifyBreed(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.BreedJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("breed").Where("id = ?", data.Id).Updates(map[string]interface{}{
		"id":             data.Id,
		"name":           data.Name,
		"average_weight": utils.NewNullInt64(int64(data.AverageWeight)),
		"species_id":     data.SpeciesId,
	})

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}

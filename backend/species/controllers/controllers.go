package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

// AddSpecies func for add new species to database.
// @Description Insert new species to the species table in Huovet schema.
// @Summary Add new species to database
// @Tags species
// @Accept json
// @Produce json
// @Param request body models.SpeciesJSON true "query body"
// @Success 200 {object} models.SpeciesDB
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /species/addSpecies [post]
func AddSpecies(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.SpeciesJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	species := models.SpeciesDB{
		Name: data.Name,
	}

	database.Database.Table("species").Create(&species)
	if species.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "species already exist",
		})
	}
	return c.JSON(species)
}

// GetSpecies func for return species information.
// @Description Return the information of the species.
// @Summary Return species information
// @Tags species
// @Accept json
// @Produce json
// @Param id path int true "species ID"
// @Success 200 {object} models.SpeciesDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /species/getSpecies/{id} [get]
func GetSpecies(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	species := models.SpeciesDB{}
	if err = database.Database.Table("species").First(&species, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(species)
}

// DeleteSpecies func for remove species from database.
// @Description Remove all the information of the species.
// @Summary Delete species information
// @Tags species
// @Accept json
// @Produce json
// @Param id path int true "Species ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /species/deleteSpecies/{id}  [delete]
func DeleteSpecies(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	species := models.SpeciesDB{}
	if err = database.Database.Table("species").Delete(&species, id).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifySpecies func for update species information.
// @Description Update the information of the species.
// @Summary Update species information
// @Tags species
// @Accept json
// @Produce json
// @Param request body models.SpeciesDB true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /species/modifySpecies [put]
func ModifySpecies(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.SpeciesDB

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("species").Where("id = ?", data.Id).Updates(map[string]interface{}{
		"id":   data.Id,
		"name": data.Name,
	})

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}

// GetSpecies func for return all species and breed.
// @Description Return the all species and releated breeds
// @Summary Returns all species
// @Tags species
// @Accept json
// @Produce json
// @Success 200 {object} models.SpeciesDB
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /species/getSpeciesAll/ [get]
func GetSpeciesAll(c *fiber.Ctx) error {
	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	species := []models.SpeciesBreedDB{}
	if err = database.Database.Table("species").Order("id").Find(&species).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	if len(species) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no species in database",
		})

	}
	breeds := []models.BreedDB{}
	if err = database.Database.Table("breed").Order("species_id").Find(&breeds).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	if len(breeds) == 0 {
		return c.JSON(species)
	}
	//is there more effective way to implement, works because breeds and species are sorted using order
	num := 0
	for j, e := range species {
		current := e.Id
		for {
			if breeds[num].SpeciesId > current {
				break
			} else if breeds[num].SpeciesId == current {
				species[j].Breeds = append(species[j].Breeds, breeds[num])
				if num < len(breeds)-1 {
					num++
				} else {
					break
				}
			} else {
				break
			}
		}
	}
	return c.JSON(species)
}

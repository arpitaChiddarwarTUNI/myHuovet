package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"


// AddStaff func for add new staff to database.
// @Description Insert new staff to the staff table in Huovet schema.
// @Summary Add new staff to database
// @Tags Staff
// @Accept json
// @Produce json
// @Param request body models.StaffAddJSON true "query body"
// @Success 200 {object} models.StaffDB
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /staff/addStaff [post]
func AddStaff(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.StaffJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	staff := models.StaffDB{
		FirstName:	data.FirstName,
		LastName:	data.LastName,
		Role:		utils.NewNullString(data.Role),
	}

	database.Database.Table("staff").Create(&staff)
	
	return c.JSON(staff)
}


// GetAllStaff func for return all staff information.
// @Description Return the information of all staff.
// @Summary Return all staff information
// @Tags Staff
// @Accept json
// @Produce json
// @Success 200  {object}  []models.StaffDB "Search success"
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /staff/getAllStaff [get]
func GetAllStaff(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	staffs := []models.StaffDB{}
	if err = database.Database.Table("staff").Find(&staffs).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(staffs)
}


// DeleteStaff func for remove staff from database.
// @Description Remove all the information of the staff.
// @Summary Delete staff information
// @Tags Staff
// @Accept json
// @Produce json
// @Param id path int true "Staff ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /staff/deleteStaff/{id}  [delete]
func DeleteStaff(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")

	staff := models.StaffDB{}
	if err = database.Database.Table("staff").Delete(&staff, id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyStaff func for update staff information.
// @Description Update the information of the staff.
// @Summary Update staff information
// @Tags Staff
// @Accept json
// @Produce json
// @Param request body models.StaffJSON true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /staff/modifyStaff [put]
func ModifyStaff(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.StaffJSON

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("staff").Where("id = ?", data.Id).Updates(map[string]interface{}{
		"id": data.Id,
		"first_name":	data.FirstName,
		"last_name":	data.LastName,
		"role": utils.NewNullString(data.Role),
	})

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}
package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

const SecretKey = "secret"


// AddTemplate func for add new template to database.
// @Description Insert new template to the template table in Huovet schema.
// @Summary Add new template to database
// @Tags Template
// @Accept json
// @Produce json
// @Param request body models.TemplateAddJSON true "query body"
// @Success 200 {object} models.Template
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /template/addTemplate [post]
func AddTemplate(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var template models.Template

	if err := c.BodyParser(&template); err != nil {
		return err
	}

	database.Database.Table("template").Create(&template)
	
	return c.JSON(template)
}



// DeleteTemplate func for remove template from database.
// @Description Remove all the information of the template.
// @Summary Delete template information
// @Tags Template
// @Accept json
// @Produce json
// @Param id path int true "Template ID"
// @Success 200 {object} models.DeleteResponse "Delete success"
// @Failure 400  {object}  models.DeleteFAilResponse "Deleting fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /template/deleteTemplate/{id}  [delete]
func DeleteTemplate(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	id, err := c.ParamsInt("id")

	template := models.Template{}
	if err = database.Database.Table("template").Delete(&template, id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting fail",
		})
	}

	return c.JSON(fiber.Map{
		"message": "delete success",
	})
}

// ModifyTemplate func for update template information.
// @Description Update the information of the template.
// @Summary Update template information
// @Tags Template
// @Accept json
// @Produce json
// @Param request body models.Template true "query body"
// @Success 200 {object} models.UpdateResponse "Update success"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /template/modifyTemplate [put]
func ModifyTemplate(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data models.Template

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.Database.Table("template").Where("id = ?", data.Id).Updates(data)

	return c.JSON(fiber.Map{
		"message": "update success",
	})
}


// GetAlltemplate func for get all template information.
// @Description Get all the information of the template.
// @Summary Get all template information
// @Tags Template
// @Accept json
// @Produce json
// @Success 200 {object} []models.Template "Search success"
// @Failure 400  {object}  models.SearchFailResponse "searching fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /template/getAllTemplate [get]
func GetAllTemplate(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	var data []models.Template

	if err = database.Database.Table("template").Find(&data).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(data)
}


// GetTemplateByAppointmentId func for return template information by appointmentId.
// @Description Get the information of the template by appointmentId.
// @Summary Get template information by appointmentId
// @Tags Template
// @Accept json
// @Produce json
// @Success 200 {object} []models.Template "Search success"
// @Failure 400  {object}  models.SearchFailResponse "searching fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /template/getTemplateByAppointmentId/{id} [get]
func GetTemplateByAppointmentId(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	appointmentTypeId, err := c.ParamsInt("id")

	var data []models.Template

	if err = database.Database.Table("template").Where("appointment_type_id = ?", appointmentTypeId).Find(&data).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(data)
}


// GetTemplate func for return Template information.
// @Description Return the information of the Template.
// @Summary Return Template information
// @Tags Template
// @Accept json
// @Produce json
// @Param id path int true "Template ID"
// @Success 200 {object} models.Template
// @Failure 400  {object}  models.SearchFailResponse "Seacring fail"
// @Failure 401  {object}  models.UnathenticatedResponse "Unauthentication"
// @Security ApiKeyAuth
// @Router /template/getTemplate/{id} [get]
func GetTemplate(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")

	template := models.Template{}
	if err = database.Database.Table("template").First(&template, id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "searching fail",
		})
	}

	return c.JSON(template)
}

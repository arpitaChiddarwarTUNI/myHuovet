package controllers

import (
	"app/database"
	"app/models"
	"app/utils"
	_ "database/sql"
	"net/url"

	"github.com/gofiber/fiber/v2"

	_ "app/docs"
)

//	func create new customer.
//
// @Description this endpoint is used to create a new customer,
// @Summary create a new customer
// @Tags create
// @Accept json
// @Produce json
// @Param request body models.CreateCustomerBody  true "query params"
// @Success 200 {object} models.CreateSuccessfulResponse
// @Failure 400 {object} models.CustomerAlreadyExistsResponse
// @Router /customer/create [post]
func Create(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	var data models.CreateCustomerBody
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	customer := models.CustomerDB{
		FirstName:     data.FirstName,
		LastName:      data.LastName,
		StreetAddress: utils.NewNullString(data.StreetAddress),
		ZipCode:       utils.NewNullString(data.ZipCode),
		Municipality:  utils.NewNullString(data.Municipality),
		PhoneNumber:   utils.NewNullString(data.PhoneNumber),
		Email:         utils.NewNullString(data.Email),
		Ssn:           utils.NewNullString(data.Ssn),
	}

	query := "UPPER(first_name)=UPPER(?) AND UPPER(last_name) = UPPER(?) AND (UPPER(email) =UPPER(?) OR UPPER(phone_number)=UPPER(?))"
	if database.DB.Table("customer").Where(query, data.FirstName, data.LastName, data.Email, data.PhoneNumber).First(&customer).RowsAffected == 0 {
		database.DB.Table("customer").Create(&customer)
	} else {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "customer already exist",
		})
	}
	return c.JSON(customer)
}

// Remove exising customer.
// @Description this endpoint is used to remove existing customer,
// @Summary remove customer
// @Tags remove
// @Accept json
// @Produce json
// @Param id path int true "Customer ID"
// @Success 200 {object} models.CustomerRemovedResponse
// @Failure	400 {object} models.CustomerNotFoundResponse
// @Router /customer/remove/{id}  [delete]
func Remove(c *fiber.Ctx) error {
	_, err := utils.ValidateJwt(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	id, err := c.ParamsInt("id")
	if err != nil {
		return err
	}
	customer := models.CustomerDB{}

	if err = database.DB.Table("customer").Delete(&customer, id).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "remove failure",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Customer remove successful",
	})

}

// Modify existing customers information
// @Description this endpoint is used to modify existing customer
// @Description NOTE ALL PARAMETERS as strings!
// @Summary modify customer
// @Tags Modify
// @Accept json
// @Produce json
// @Param request body models.Customer true "query params"
// @Success 200 {object} models.ModifySuccessfulResponse
// @Failure 400 {object} models.ModifyFailureResponse
// @Failure	404 {object} models.CustomerNotFoundResponse
// @Router /customer/modify [put]
func Modify(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data models.Customer
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	database.DB.Table("customer").Where("id = ?", data.Id).Updates(map[string]interface{}{

		"first_name":     data.FirstName,
		"last_name":      data.LastName,
		"street_address": utils.NewNullString(data.StreetAddress),
		"zip_code":       utils.NewNullString(data.ZipCode),
		"municipality":   utils.NewNullString(data.Municipality),
		"phone_number":   utils.NewNullString(data.PhoneNumber),
		"email":          utils.NewNullString(data.Email),
		"ssn":            utils.NewNullString(data.Ssn),
	})

	return c.JSON(fiber.Map{
		"message": "update successful",
	})

}

// Get customer
// @Description this endpoint is used to return a customer,
// @Summary get customer
// @Tags get
// @Accept json
// @Produce json
// @Param id path int true "Customer ID"
// @Success 200 {object} models.CustomerDB
// @Failure	404 {object} models.CustomerNotFoundResponse
// @Router /customer/get/{id} [get]
func Get(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, err := c.ParamsInt("id")
	if err != nil {
		return err
	}
	customer := models.CustomerDB{}
	if err = database.DB.Table("customer").Where("id=?", id).First(&customer).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "customer not found",
		})
	}
	return c.JSON(customer)
}

// Get patients related customer
// @Description this endpoint is used to return patients related to customer,
// @Summary get patients related to customer
// @Tags patient
// @Accept json
// @Produce json
// @Param id path int true "Customer ID"
// @Success 200 {object} models.Patient
// @Failure	404 {object} models.CustomerNotFoundResponse
// @Router /customer/{id}/patients/ [get]
func Patients(c *fiber.Ctx) error {
	_, err := utils.ValidateJwt(c)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	id, parseErr := c.ParamsInt("id")
	if parseErr != nil {
		return parseErr
	}

	var patiens []models.PatientDB
	if err := database.DB.Table("patient").Where("customer_id=?", id).Find(&patiens).Error; err != nil {
		c.Status((fiber.StatusNotFound))

		return c.JSON(fiber.Map{
			"message": "customer id not found",
		})
	}
	if len(patiens) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "no patients found",
		})
	}
	return c.JSON(patiens)
}

// Search customer
// @Description this endpoint is used to search customer,
// @Summary find customer and return id,firstname and lastname
// @Tags search
// @Accept json
// @Produce json
// @Param input path string true "search parameter"
// @Success 200 {object} models.CustomerSearchBody
// @Failure	404 {object} models.CustomerNotFoundResponse
// @Router /customer/search/{input} [get]
func Search(c *fiber.Ctx) error {

	_, err := utils.ValidateJwt(c)
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}
	query := `
	CONCAT(customer.first_name,' ',customer.last_name) LIKE (CONCAT('%', ? ,'%')) OR
	CONCAT(customer.last_name,' ',customer.first_name) LIKE (CONCAT('%', ? ,'%')) OR
	customer.phone_number LIKE (CONCAT('%', ? ,'%')) OR
	customer.email LIKE (CONCAT('%', ? ,'%')) OR
	patient.name LIKE (CONCAT('%', ? ,'%'))
	`

	data := c.Params("input")
	input, err := url.QueryUnescape(data)
	if err != nil {
		return err
	}

	customers := []models.CustomerSearch{}
	//.Distinct("customer.id", "customer.first_name", "customer.last_name")
	if err := database.DB.Table("customer").Joins("left join patient on customer.id = patient.customer_id").Distinct("customer.id", "customer.first_name", "customer.last_name").Where(query, input, input, input, input, input).Find(&customers).Limit(50).Select("customer.id", "customer.first_name", "customer.last_name").Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Query Error",
		})
	}
	if len(customers) == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Customer not found",
		})
	}

	return c.JSON(customers)
}

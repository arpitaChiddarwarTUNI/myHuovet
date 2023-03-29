package controllers

import (
	"app/database"
	"app/models"
	"app/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"strconv"
	"time"	

	_ "app/docs"
)

const SecretKey = "secret"

// Register func register a new user.
// @Description Add a new user to database. Calculates a hash value from the user's password,
// @Description which is stored in the database instead of the password.
// @Summary register a new user
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body models.RegisterRequestBody true "query params"
// @Success 200 {object} models.RegisterSuccessResponse
// @Failure 400  {object}  models.RegisterResponse "Email is already in use"
// @Router /auth/register [post]
func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	user := models.User{
		FirstName:     data["firstName"],
		LastName:     data["lastName"],
		Email:    data["email"],
		Password: password,
	}

	if database.DB.Where("email = ?", data["email"]).First(&user).RowsAffected == 0 {
		database.DB.Create(&user)
	} else {
		return c.JSON(fiber.Map{
			"message": "email is already in use",
		})
	}

	return c.JSON(fiber.Map{
		"message": "register success",
	})
}


// Login func register a new user.
// @Summary      Login with user
// @Description  This endpoint allows the user to log in. When the user logs in, a JWT is created in the cookie.
// @Description  The cookie is valid for 24 hours.
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param request body models.LoginRequestBody true "query params"
// @Success      200  {object}   models.LoginSuccessResponse
// @Failure      400  {object}  models.UserNotFoundResponse "User not found"
// @Failure      400  {object}  models.IncorrectPasswordResponse "Incorrect password"
// @Failure      500  {object}  models.LoginFailResponse
// @Router       /auth/login [post]
func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.Id == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "incorrect password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), //1 day
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "login fail",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "login success",
	})
}


// Logout func for log out of the user.
// @Description Log out of the user and remove the cookie.
// @Summary User logout
// @Tags Auth
// @Accept json
// @Produce json
// @Success 200 {object} models.LogoutResponse
// @Router /auth/logout [post]
func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Logout success",
	})
}


// User func for return user information.
// @Description Return the information of the logged in user.
// @Summary Return user information
// @Tags Auth
// @Accept json
// @Produce json
// @Success 200 {object} models.User
// @Failure 401 {object} models.UnathenticatedResponse "Unathenticated"
// @Security ApiKeyAuth
// @Router /auth/user [get]
func User(c *fiber.Ctx) error {

	token, err := utils.ValidateJwt(c)

	if err != nil {
        c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
    }

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}
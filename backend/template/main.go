package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)

// @title Huovet template API
// @version 1.0
// @description This App is used to control the template. It can:
// @description - Add a new template
// @description - Delete the template
// @description - Modify the template
// @description - Get all template
// @description - Get templates by appointmentTypeId
// @description - Get templates by templateId

// @host localhost:5012
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5012")
}
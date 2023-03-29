package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)


// @title Huovet appointmentType API
// @version 1.0
// @description This App is used to control the appointmentType. It can:
// @description - Add a new appointmentType
// @description - Delete the appointmentType
// @description - Modify the appointmentType
// @description - Get all appointmentType

// @host localhost:5009
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5009")
}
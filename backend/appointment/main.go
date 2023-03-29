package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)


// @title Huovet appointment API
// @version 1.0
// @description This App is used to control the appointment. It can:
// @description - Add a new appointment
// @description - Get the appointment by id
// @description - Get all appointments
// @description - Get all customer appintment by customerId
// @description - Delete the appointment
// @description - Modify the appointment
// @description - Set the appointment billed field to true

// @host localhost:5003
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5003")
}
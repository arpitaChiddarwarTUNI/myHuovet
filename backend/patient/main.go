package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)


// @title Huovet patient API
// @version 1.0
// @description This App is used to control the patient. It can:
// @description - Add a new patient
// @description - Get the patient
// @description - Delete the patient
// @description - Modify the patient

// @host localhost:5001
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5001")
}
package main

import (
	"app/database"
	"app/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)

// @title Huovet medicine API
// @version 1.0
// @description This App is used to control the medicine. It can:
// @description - Add a new medicine
// @description - Get the medicine
// @description - Delete the medicine
// @description - Modify the medicine

// @host localhost:5006
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5006")
}

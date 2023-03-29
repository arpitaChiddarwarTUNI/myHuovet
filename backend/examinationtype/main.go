package main

import (
	"app/database"
	"app/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)

// @title Huovet examinationType API
// @version 1.0
// @description This App is used to control the examinationType. It can:
// @description - Add a new examinationType
// @description - Get the examinationType
// @description - Delete the examinationType
// @description - Modify the examinationType

// @host localhost:5010
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5010")
}

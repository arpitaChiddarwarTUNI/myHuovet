package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)


// @title Huovet staff API
// @version 1.0
// @description This App is used to control the staff. It can:
// @description - Add a new staff
// @description - Get all staff
// @description - Delete the staff
// @description - Modify the staff

// @host localhost:5007
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5007")
}
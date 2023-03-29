package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)


// @title Huovet supply API
// @version 1.0
// @description This App is used to control the supply. It can:
// @description - Add a new supply
// @description - Delete the supply
// @description - Modify the supply
// @description - Get all supplies

// @host localhost:5008
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5008")
}
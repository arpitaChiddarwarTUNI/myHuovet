package main

import (
	"app/database"
	"app/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)

// @title Huovet diagnosis API
// @version 1.0
// @description This App is used to control the diagnosis. It can:
// @description - Add a new diagnosis
// @description - Get the diagnosis
// @description - Delete the diagnosis
// @description - Modify the diagnosis

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

	app.Listen(":5011")
}

package main

import (
	"app/database"
	"app/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)

const portNum = ":5004"

// @title Huovet species API
// @version 0.1
// @description This App is used to interact with species. It can:
// @description - Create new species
// @description - remove species
// @description - Modify existing species
// @description - Get species
// @description - Get all species and releated breeds
// @host localhost:5004
// @BasePath /
// @schemes http

func main() {
	database.Connect()
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(portNum)
}

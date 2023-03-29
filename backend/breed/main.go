package main

import (
	"app/database"
	"app/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)

const portNum = ":5005"

// @title Huovet breed API
// @version 0.1
// @description This App is used to interact with breed. It can:
// @description - Create new breed
// @description - remove breed
// @description - Modify existing breed
// @description - Get breed
// @host localhost:5005
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

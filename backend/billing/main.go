package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)


// @title Huovet billing API
// @version 1.0
// @description This App is used to control the bills. It can:
// @description - Add a new bill
// @description - Delete the bill
// @description - Modify the bill
// @description - Get the bill
// @description - Get all bills

// @host localhost:5013
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5013")
}
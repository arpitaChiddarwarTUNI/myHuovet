package main

import (
	"app/database"
	"app/routes"
	"github.com/gofiber/fiber/v2"
  	"github.com/gofiber/fiber/v2/middleware/cors"

	_ "app/docs"
)


// @title Huovet authentication API
// @version 1.0
// @description This App is used to authenticate the user. It can:
// @description - Register a new user
// @description - Login with user
// @description - Get the information of the logged in user
// @description - Log out of the user

// @host localhost:5000
// @BasePath /
// @schemes http

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":5000")
}
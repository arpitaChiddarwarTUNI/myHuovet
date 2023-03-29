package main

import (
	"app/database"
	"app/routes"
  
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	
	_ "app/docs"
)

const portNum = ":5002"

// @title Huovet customer API
// @version 0.1
// @description This App is used to interact with customers. It can:
// @description - Create new customers
// @description - remove customers
// @description - Modify existing customers
// @description - Get customers
// @host localhost:5002
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

package routes

import (
	"app/controllers"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/arsmn/fiber-swagger/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/auth/register", controllers.Register)
	app.Post("/auth/login", controllers.Login)
	app.Get("/auth/user", controllers.User)
	app.Post("/auth/logout", controllers.Logout)
	app.Get("/docs/*", swagger.HandlerDefault)

}



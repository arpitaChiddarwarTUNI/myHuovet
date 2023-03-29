package routes

import (
	"app/controllers"
	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/customer/create", controllers.Create)
	app.Delete("/customer/remove/:id", controllers.Remove)
	app.Put("/customer/modify", controllers.Modify)
	app.Get("/customer/get/:id", controllers.Get)
	//app.Get("/customer/patients/:id", controllers.Patients)
	app.Get("/customer/:id/patients/", controllers.Patients)
	app.Get("/customer/search/:input", controllers.Search)
	app.Get("/docs/*", swagger.HandlerDefault)
}

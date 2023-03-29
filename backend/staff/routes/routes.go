package routes

import (
	"app/controllers"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/arsmn/fiber-swagger/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/staff/addStaff", controllers.AddStaff)
	app.Get("/staff/getAllStaff", controllers.GetAllStaff)
	app.Delete("/staff/deleteStaff/:id", controllers.DeleteStaff)
	app.Put("/staff/modifyStaff", controllers.ModifyStaff)
	app.Get("/docs/*", swagger.HandlerDefault)

}



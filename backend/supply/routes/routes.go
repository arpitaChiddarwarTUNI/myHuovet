package routes

import (
	"app/controllers"

	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/supply/addSupply", controllers.AddSupply)
	app.Delete("/supply/deleteSupply/:id", controllers.DeleteSupply)
	app.Put("/supply/modifySupply", controllers.ModifySupply)
	app.Get("/supply/getAllSupplies", controllers.GetAllSupplies)
	app.Get("/docs/*", swagger.HandlerDefault)

}

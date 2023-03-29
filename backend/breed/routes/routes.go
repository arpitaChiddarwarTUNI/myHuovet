package routes

import (
	"app/controllers"

	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/breed/addBreed", controllers.AddBreed)
	app.Get("/breed/getBreed/:id", controllers.GetBreed)
	app.Delete("/breed/deleteBreed/:id", controllers.DeleteBreed)
	app.Put("/breed/modifyBreed", controllers.ModifyBreed)
	app.Get("/docs/*", swagger.HandlerDefault)

}

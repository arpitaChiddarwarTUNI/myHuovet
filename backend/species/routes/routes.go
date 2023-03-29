package routes

import (
	"app/controllers"

	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/species/addSpecies", controllers.AddSpecies)
	app.Get("/species/getSpecies/:id", controllers.GetSpecies)
	app.Get("/species/getSpeciesAll", controllers.GetSpeciesAll)
	app.Delete("/species/deleteSpecies/:id", controllers.DeleteSpecies)
	app.Put("/species/modifySpecies", controllers.ModifySpecies)
	app.Get("/docs/*", swagger.HandlerDefault)

}

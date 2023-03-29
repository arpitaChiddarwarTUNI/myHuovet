package routes

import (
	"app/controllers"

	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/diagnosis/addDiagnosis", controllers.AddDiagnosis)
	app.Get("/diagnosis/getDiagnosis/:id", controllers.GetDiagnosis)
	app.Delete("/diagnosis/deleteDiagnosis/:id", controllers.DeleteDiagnosis)
	app.Put("/diagnosis/modifyDiagnosis", controllers.ModifyDiagnosis)
	app.Get("/diagnosis/getAllDiagnosis", controllers.GetAllDiagnosis)
	app.Get("/docs/*", swagger.HandlerDefault)

}

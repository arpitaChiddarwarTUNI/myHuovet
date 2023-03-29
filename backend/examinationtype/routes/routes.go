package routes

import (
	"app/controllers"

	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/examinationtype/addExaminationtype", controllers.AddExaminationtype)
	app.Get("/examinationtype/getExaminationtype/:id", controllers.GetExaminationtype)
	app.Get("/examinationtype/getAllExaminationtype/", controllers.GetAllExaminationtype)
	app.Delete("/examinationtype/deleteExaminationtype/:id", controllers.DeleteExaminationtype)
	app.Put("/examinationtype/modifyExaminationtype", controllers.ModifyExaminationtype)
	app.Get("/docs/*", swagger.HandlerDefault)

}

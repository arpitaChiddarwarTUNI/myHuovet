package routes

import (
	"app/controllers"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/arsmn/fiber-swagger/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/template/addTemplate", controllers.AddTemplate)
	app.Delete("/template/deleteTemplate/:id", controllers.DeleteTemplate)
	app.Put("/template/modifyTemplate", controllers.ModifyTemplate)
	app.Get("/template/getTemplateByAppointmentId/:id", controllers.GetTemplateByAppointmentId)
	app.Get("/template/getTemplate/:id", controllers.GetTemplate)
	app.Get("/template/getAllTemplate", controllers.GetAllTemplate)
	app.Get("/docs/*", swagger.HandlerDefault)

}



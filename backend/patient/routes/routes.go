package routes

import (
	"app/controllers"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/arsmn/fiber-swagger/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/patient/addPatient", controllers.AddPatient)
	app.Get("/patient/getPatient/:id", controllers.GetPatient)
	app.Delete("/patient/deletePatient/:id", controllers.DeletePatient)
	app.Put("/patient/modifyPatient", controllers.ModifyPatient)
	app.Get("/docs/*", swagger.HandlerDefault)

}



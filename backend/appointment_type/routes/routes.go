package routes

import (
	"app/controllers"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/arsmn/fiber-swagger/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/appointmentType/addAppointmentType", controllers.AddAppointmentType)
	app.Delete("/appointmentType/deleteAppointmentType/:id", controllers.DeleteAppointmentType)
	app.Put("/appointmentType/modifyAppointmentType", controllers.ModifyAppointmentType)
	app.Get("/appointmentType/getAllAppointmentType", controllers.GetAllAppointmentType)
	app.Get("/docs/*", swagger.HandlerDefault)

}



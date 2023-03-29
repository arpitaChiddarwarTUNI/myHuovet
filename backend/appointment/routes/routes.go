package routes

import (
	"app/controllers"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/arsmn/fiber-swagger/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/appointment/addAppointment/:patientId", controllers.AddAppointment)
	app.Get("/appointment/getAppointment/:id", controllers.GetAppointment)
	app.Get("/appointment/listAllAppointment", controllers.ListAllAppointment)
	app.Get("/appointment/customerAppointments/:customerId", controllers.CustomerAppointments)
	app.Delete("/appointment/deleteAppointment/:id", controllers.DeleteAppointment)
	app.Put("/appointment/modifyAppointment", controllers.ModifyAppointment)
	app.Put("/appointment/billedAppointment/:id", controllers.BilledAppointment)
	app.Get("/docs/*", swagger.HandlerDefault)

}



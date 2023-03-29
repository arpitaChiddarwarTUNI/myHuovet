package routes

import (
	"app/controllers"
	"github.com/gofiber/fiber/v2"
	swagger "github.com/arsmn/fiber-swagger/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/billing/addBill", controllers.AddBill)
	app.Delete("/billing/deleteBill/:appointment_id", controllers.DeleteBill)
	app.Put("/billing/modifyBill", controllers.ModifyBill)
	app.Get("/billing/getBill/:appointment_id", controllers.GetBill)
	app.Get("/docs/*", swagger.HandlerDefault)

}



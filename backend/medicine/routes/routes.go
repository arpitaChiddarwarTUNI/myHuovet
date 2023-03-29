package routes

import (
	"app/controllers"

	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// Routes
	app.Post("/medicine/addMedicine", controllers.AddMedicine)
	app.Get("/medicine/getMedicine/:id", controllers.GetMedicine)
	app.Get("/medicine/getAllMedicine/", controllers.GetAllMedicine)
	app.Delete("/medicine/deleteMedicine/:id", controllers.DeleteMedicine)
	app.Put("/medicine/modifyMedicine", controllers.ModifyMedicine)
	app.Get("/docs/*", swagger.HandlerDefault)

}

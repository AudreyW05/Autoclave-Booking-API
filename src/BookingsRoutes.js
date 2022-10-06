const BookingsController = require("./BookingsController");

const BookingsRouter = async (event) => {
  let body;
  // Get All
  if (event.routeKey === "GET /bookings/getAll") {
    body = await BookingsController.getAll();
  }

  // Get 1
  if (event.routeKey === "GET /bookings/{uuid}") {
    body = await BookingsController.getOneBooking(event.pathParameters.uuid);
  }

  // Get self
  if (event.routeKey === "GET /bookings/getSelf/{userId}") {
    body = await BookingsController.getSelf(
      parseInt(event.pathParameters.userId)
    );
  }

  // Create 1
  if (event.routeKey === "POST /bookings") {
    const requestJSON = JSON.parse(event.body);
    const userId = parseInt(requestJSON.userId);
    const date = requestJSON.date;
    const timeslot = requestJSON.timeslot;
    const supervisor = requestJSON.supervisor;
    body = await BookingsController.createBooking(
      userId,
      date,
      timeslot,
      supervisor
    );
  }

  // Delete 1
  if (event.routeKey === "DELETE /bookings/{uuid}") {
    body = await BookingsController.deleteOneBooking(event.pathParameters.uuid);
  }

  if (event.routeKey === "POST /bookings/sendMail") {
    const requestJSON = JSON.parse(event.body);
    body = await BookingsController.sendMail(requestJSON);
  }

  return body;
};

module.exports = BookingsRouter;

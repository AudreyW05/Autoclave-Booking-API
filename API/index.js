const stringUtils = require("./src/utils/stringUtils");
const BookingsRouter = require("./src/BookingsRoutes");

exports.handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  const BOOKINGS_ROUTE = "bookings";
  const currentPath = stringUtils.getPath(event.rawPath);

  try {
    if (currentPath == BOOKINGS_ROUTE) {
      body = await BookingsRouter(event);
    }
  } catch (err) {
    statusCode = 400;
    body = { message: err.message };
  } finally {
    body = JSON.stringify(body);
  }

  const response = {
    body,
    statusCode,
    headers,
  };
  return response;
};

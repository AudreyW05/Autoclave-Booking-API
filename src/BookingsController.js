require("dotenv").config();
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.BOOKINGS_TABLE_NAME;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

module.exports = {
  getAll: async () => {
    const allBookings = await dynamoDb
      .scan({ TableName: TABLE_NAME })
      .promise();
    return {
      message: "Successfully retrieved Bookings.",
      data: allBookings.Items,
    };
  },

  getOneBooking: async (bookingUuid) => {
    const booking = await dynamoDb
      .get({
        TableName: TABLE_NAME,
        Key: {
          uuid: bookingUuid,
        },
      })
      .promise();

    if (booking.Item === undefined) {
      throw new Error("Booking cannot be found");
    }
    return {
      message: "Successfully retrieved Booking.",
      data: booking.Item,
    };
  },

  getSelf: async (userId) => {
    const allBookings = await dynamoDb
      .scan({ TableName: TABLE_NAME })
      .promise();
    const selfBookings = allBookings.Items.filter(
      (booking) => booking.userId === userId
    );
    return {
      message: "Successfully retrieved self Bookings",
      data: selfBookings,
    };
  },

  createBooking: async (userId, date, timeslot) => {
    const allBookings = await dynamoDb
      .scan({ TableName: TABLE_NAME })
      .promise();
    if (
      allBookings.Items.filter(
        (booking) => booking.date === date && booking.timeslot === timeslot
      ).length >= 2
    ) {
      throw new Error("Booking time not available");
    } else {
      const uuid = crypto.randomUUID();
      await dynamoDb
        .put({
          TableName: TABLE_NAME,
          Item: {
            uuid: uuid,
            userId: userId,
            date: date,
            timeslot: timeslot,
          },
        })
        .promise();
      return { message: "Successfully created Booking." };
    }
  },

  deleteOneBooking: async (bookingUuid) => {
    await dynamoDb
      .delete({
        TableName: TABLE_NAME,
        Key: {
          uuid: bookingUuid,
        },
      })
      .promise();
    return { message: "Successfully deleted Booking." };
  },
};

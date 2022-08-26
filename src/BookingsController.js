require("dotenv").config();
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.BOOKINGS_TABLE_NAME;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
import UserFriendlyMessages from "./consts/UserFriendlyMessages";

module.exports = {
  getAll: async () => {
    const allBookings = await dynamoDb
      .scan({ TableName: TABLE_NAME })
      .promise();
    return {
      message: UserFriendlyMessages.success.getAllBookings,
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
    return {
      message: UserFriendlyMessages.success.getOneBooking,
      data: booking,
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
      message: UserFriendlyMessages.success.selfBookings,
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
      return { message: UserFriendlyMessages.success.createBooking };
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
    return { message: UserFriendlyMessages.success.deleteOneBooking };
  },
};

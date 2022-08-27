require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = {
  getPayload: (accessToken) => {
    return jwt.decode(accessToken);
  },
  verifyToken: (accessToken) => {
    return jwt.verify(accessToken, process.env.SECRET_KEY);
  },
};

require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (payload, options = {}) => {
    return jwt.sign(payload, process.env.SECRET_KEY, options);
  },
};

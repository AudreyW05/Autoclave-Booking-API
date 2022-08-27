const jwtUtils = require("./utils/jwtUtils");

exports.handler = async (event) => {
  const accessToken = event.headers['x-auth-token']
  try {
    if (!accessToken) {
      throw new Error("Token Not Found!");
    }
    const payload = jwtUtils.getPayload(accessToken);
    if (!payload) {
      throw new Error("Malformed Token!");
    }
    jwtUtils.verifyToken(accessToken);
    return {
      isAuthorized: true,
    };
  } catch (err) {
    const message = err.message;
    return {
      isAuthorized: false,
      context: {
        message: message,
      },
    };
  }
};

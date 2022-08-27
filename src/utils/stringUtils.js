module.exports = {
  getPath: (rawPath) => {
    let path = rawPath.substring(1, rawPath.length);
    const end = path.indexOf("/") === -1 ? path.length : path.indexOf("/");
    path = path.substring(0, end);
    return path;
  },
};

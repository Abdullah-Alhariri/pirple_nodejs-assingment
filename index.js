const server = require("./lib/server.js");
const app = {};

app.init = function () {
  // Start the server
  server.init();
};

app.init();

module.exports = app;

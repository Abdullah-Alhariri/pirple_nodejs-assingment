const server = require("./lib/server.js");
const cli = require("./lib/cli");
const app = {};

app.init = function () {
  server.init();
  cli.init();
};

app.init();

module.exports = app;

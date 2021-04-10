const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const handler = require("./handlers");
const helpers = require("./helpers");
const controller = require("./controller");
const server = {};
const fs = require("fs");
const render = require("./template/app.js");

server.httpServer = http.createServer(function (req, res) {
  let statusCode = 200;
  res.writeHead(statusCode, { "content-type": "text/html" });
  const parseUrl = url.parse(req.url);
  const path = parseUrl.path;
  const pathName = path.replace(/^\/+|\/+$/g, "");
  const checkId = helpers.createRandomString(20);
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();
    const data = {
      id: checkId,
      payload: buffer,
    };
    if (pathName === "") {
      fs.readFile(
        `${__dirname}/template/index.html`,
        null,
        function (err, data) {
          if (!err && data) {
            res.write(data);
            render.css(res); //TODO
            res.end();
          } else {
            res.writeHead(404);
            res.write("file not found " + data + err);
            res.end();
          }
        }
      );
    } else if (pathName === "makeUser") {
      controller.makeUser(data, function (err, msg = "") {
        if (!err) {
          res.write(msg);
          res.end();
        } else {
          res.writeHead(400);
          res.write(`Error: ${err}`);
          res.end();
        }
      });
    } else if (pathName === "editUser") {
      controller.editUser(buffer, function (err, msg = "") {
        if (!err) {
          res.write(msg);
          res.end();
        } else {
          res.writeHead(400);
          res.write(`${err}`);
          res.end();
        }
      });
    } else if (pathName === "deleteUser") {
      controller.deleteUser(buffer, function (err, msg = "") {
        if (!err) {
          res.write(msg);
          res.end();
        } else {
          res.writeHead(400);
          res.write(`${err}`);
          res.end();
        }
      });
    } else if (pathName === "menu") {
      controller.menu(function (err, menu = "") {
        if (!err) {
          res.write(menu);
          res.end();
        } else {
          res.writeHead(400);
          res.write(`${err}`);
          res.end();
        }
      });
    } else {
      res.writeHead(404);
      res.write("you can go to makeUser, editUser, deleteUser or menu");
      res.end();
    }
  });
});

server.init = function () {
  server.httpServer.listen(config.httpPort, function () {
    console.log("\x1b[36m%s\x1b[0m", `HTTP running on: ${config.httpPort}`);
  });
};

module.exports = server;

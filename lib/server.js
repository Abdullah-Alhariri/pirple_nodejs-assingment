const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const handler = require("./handlers");
const helpers = require("./helpers");
const controller = require("./controller");
const fs = require("fs");
const render = require("./template/render.js");

const server = {};

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

    if (pathName === "")
      render.template(`${__dirname}/template/index.html`, res);
    else if (pathName === "makeUser") {
      render.template(`${__dirname}/template/makeUser.html`, res);
      // controller.makeUser(data, function (err, msg = "") {
      //   if (!err) {
      //     res.write(msg);
      //     res.end();
      //   } else {
      //     res.writeHead(400);
      //     res.write(`Error: ${err}`);
      //     res.end();
      //   }
      // });
    } else if (pathName === "editUser") {
      render.template(`${__dirname}/template/editUser.html`, res);
      // controller.editUser(buffer, function (err, msg = "") {
      //   if (!err) {
      //     res.write(msg);
      //     res.end();
      //   } else {
      //     res.writeHead(400);
      //     res.write(`${err}`);
      //     res.end();
      //   }
      // });
    } else if (pathName === "deleteUser") {
      render.template(`${__dirname}/template/deleteUser.html`, res);
      // controller.deleteUser(buffer, function (err, msg = "") {
      //   if (!err) {
      //     res.write(msg);
      //     res.end();
      //   } else {
      //     res.writeHead(400);
      //     res.write(`${err}`);
      //     res.end();
      //   }
      // });
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

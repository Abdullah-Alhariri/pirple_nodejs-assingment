const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const handler = require("./handlers");
const helpers = require("./helpers");
const controller = require("./controller");
const fs = require("fs");
const qs = require("querystring");
const render = require("./template/render.js");

const server = {};
debugger;
server.replaceAll = function (string, search, replace) {
  return string.split(search).join(replace);
};
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
    let data = {
      id: checkId,
      payload: buffer,
    };
    if (pathName === "makeUser") {
      if (render.template(`${__dirname}/template/makeUser.html`, res)) {
      }

      if (data.payload) {
        let [name, streetAddress, email] = data.payload.split("&");
        name = server.replaceAll(name.split("=")[1], "+", " ");
        streetAddress = server.replaceAll(
          streetAddress.split("=")[1],
          "+",
          " "
        );
        email = server
          .replaceAll(email.split("=")[1], "+", " ")
          .replace("%40", "@");
        let outputData = {
          id: checkId,
          payload: {
            name,
            streetAddress,
            email,
          },
        };
        controller.makeUser(outputData, function (err, msg = "") {
          if (err) {
            res.write(
              `<h1 class="errorMessage">there is an error: ${err}</h1>`
            );
            res.end();
          } else {
            res.write(
              `<h1 class="sucMessage">your id is: <span class="User-ID">${outputData.id}</span></h1>`
            );
            res.end();
          }
        });
      }
    } else if (pathName === "editUser") {
      render.template(`${__dirname}/template/editUser.html`, res);
      const outputData = helpers.formatPayload(buffer);
      if (Object.keys(outputData)[0] !== "") {
        controller.editUser(outputData, function (err, msg = "") {
          if (err) {
            res.write(`<h1 class="errorMessage">error accured: ${err}</h1>`);
            res.end();
          } else {
            res.write(`<h1 class="sucMessage">${msg}</h1>`);
            res.end();
          }
        });
      } else {
        console.log("\nthere is no data sended");
      }
    } else if (pathName === "deleteUser") {
      render.template(`${__dirname}/template/deleteUser.html`, res);
      const outputData = helpers.formatPayload(buffer);
      setTimeout(() => {
        if (Object.keys(outputData)[0] !== "") {
          controller.deleteUser(outputData, function (err, msg = "") {
            if (err) {
              res.write(`<h1 class="errorMessage">error accured: ${err}</h1>`);
              res.end();
            } else {
              res.write(`<h1 class="sucMessage">${msg}</h1>`);
              res.end();
            }
          });
        }
      }, 100);
    } else if (pathName === "menu") {
      render.template(`${__dirname}/template/menu.html`, res, "Menu");
      setInterval(() => {
        res.end();
      }, 100);
    } else {
      render.template(`${__dirname}/template/index.html`, res, "index");
      setInterval(() => {
        res.end();
      }, 100);
    }
  });
});
server.init = function () {
  server.httpServer.listen(config.httpPort, function () {
    console.log("\x1b[36m%s\x1b[0m", `HTTP running on: ${config.httpPort}`);
  });
};

module.exports = server;

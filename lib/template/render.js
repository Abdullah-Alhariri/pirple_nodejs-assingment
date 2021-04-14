const fs = require("fs");
const { rawListeners } = require("process");
const render = {};

render.template = function (path, res, place = "") {
  fs.readFile(path, null, function (err, data) {
    if (!err && data) {
      res.write(data);
    } else {
      res.writeHead(404);
    }
  });
};

module.exports = render;

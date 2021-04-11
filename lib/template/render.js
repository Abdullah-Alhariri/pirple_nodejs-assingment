const fs = require("fs");
const render = {};

render.template = function (path, res) {
  fs.readFile(path, null, function (err, data) {
    if (!err && data) {
      res.write(data);
      res.end();
    } else {
      res.writeHead(404);
      res.write("file not found");
      res.end();
    }
  });
};

module.exports = render;

const fs = require("fs");
const { rawListeners } = require("process");
const render = {};

render.template = function (path, res, place = "") {
  fs.readFile(path, null, function (err, data) {
    if (!err && data) {
      res.write(data);
      let allawedData = ["deleteUser", "editUser", "index", "menu"];
      if (allawedData.includes(place)) {
        res.end();
      }
    } else {
      res.writeHead(404);
      if (typeof place == "string") {
        res.end();
      }
    }
  });
};

module.exports = render;

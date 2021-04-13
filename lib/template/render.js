const fs = require("fs");
const { rawListeners } = require("process");
const render = {};

render.template = function (path, res, place = "") {
  fs.readFile(path, null, function (err, data) {
    if (!err && data) {
      res.write(data);
      // let allawedData = ["deleteUser", "editUser", "index", "menu"];
      // if (allawedData.includes(place)) {
      //   res.end();
      // }
      return true;
    } else {
      res.writeHead(404);
      // if (allawedData.includes(place)) {
      //   res.end();
      // }
      return false;
    }
    return "this";
  });
};

module.exports = render;

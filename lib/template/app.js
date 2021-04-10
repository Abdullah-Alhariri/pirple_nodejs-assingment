const fs = require("fs");

// const render = {};

// render.template = function (path, res) {
//   fs.readFile(path, null, function (err, data) {
//     if (!err && data) {
//       res.write(data);
//       res.writeHead(404, { "content-type": "application/json" });
//     } else {
//       res.writeHead(200, { "content-type": "text/html" });
//       res.writeHead(404);
//       res.write("file not found");
//     }
//   });
// };

const render = {};
render.css = function (res) {
  res.writeHead(200, { "Content-type": "text/css" });
  var fileContents = fs.readFileSync("lib/template/style.css", {
    encoding: "utf8",
  });
  res.write(fileContents);
};
module.exports = render;

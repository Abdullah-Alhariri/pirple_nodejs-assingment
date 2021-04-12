const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const handler = require("./handlers");
const _data = require("./data");
const fs = require("fs");
const helpers = require("./helpers");

const controller = {};

controller.makeUser = function (data, callback) {
  if (data.payload) {
    if (typeof data === "object")
      fs.open(
        `${__dirname}/../data/users/${data.id}.json`,
        "wx",
        function (err, fileD) {
          if (!err && fileD) {
            const writeData = `{"email":"${data.payload.email}","streetAddress":"${data.payload.streetAddress}","id":"${data.id}"}`;
            fs.writeFile(fileD, writeData, function (err) {
              if (!err) {
                fs.close(fileD, function (err) {
                  if (!err) {
                    callback(false, writeData);
                  } else {
                    callback("error closing new file");
                  }
                });
              } else {
                callback("error writing to new file");
              }
            });
          } else {
            callback("did't give us the: \nemail\nstreetAddress\n");
          }
        }
      );
  } else {
    callback("refresh Error");
  }
};
controller.editUser = function (buffer, callback) {
  const data = helpers.parseJsonToObject(buffer);
  fs.readFile(
    `./../main/data/users/${data.id}.txt`,
    "utf8",
    function (err, _data) {
      if (!err && _data) {
        if ((data.id && data.streetAddress) || data.email) {
          if (data.id && data.email && data.streetAddress) {
            let parsedData = helpers.parseJsonToObject(_data);
            let allUpdate = `
            {
              "email": "${data.email}",
              "streetAddress": "${data.streetAddress}",
              "id": "${data.id}"
            }`;
            fs.writeFile(
              `./../main/data/users/${data.id}.txt`,
              allUpdate,
              function (err) {
                if (!err) {
                  callback(
                    false,
                    `your email and streetAddress has been updated: \n${allUpdate}`
                  );
                } else {
                  callback(true, `there are a Error: \n${allUpdate}`);
                }
              }
            );
          } else if (data.id && data.streetAddress && !data.email) {
            let parsedData = helpers.parseJsonToObject(_data);
            let streetUpdate = `
            {
              "email": "${parsedData.email}",
              "streetAddress": "${data.streetAddress}",
              "id": "${data.id}"
            }`;
            fs.writeFile(
              `./../main/data/users/${data.id}.txt`,
              streetUpdate,
              function (err) {
                if (!err) {
                  callback(
                    false,
                    `your streetAddress has been updated: \n${streetUpdate}`
                  );
                } else {
                  callback(true, `there are a Error: \n${streetUpdate}`);
                }
              }
            );
          } else if (data.id && data.email && !data.streetAddress) {
            let parsedData = helpers.parseJsonToObject(_data);
            let emailUpdate = `
            {
              "email": "${data.email}",
              "streetAddress": "${parsedData.streetAddress}",
              "id": "${data.id}"
            }`;
            fs.writeFile(
              `./../main/data/users/${data.id}.txt`,
              emailUpdate,
              function (err) {
                if (!err) {
                  callback(
                    false,
                    `your email has been updated: \n${emailUpdate}`
                  );
                } else {
                  callback(true, `there are a Error: \n${emailUpdate}`);
                }
              }
            );
          }
        } else {
          callback(
            "you must specify id and new streetAddress or id and new email"
          );
        }
      } else {
        callback(
          "we can't find your id, you may did'n send the id or you may have deleted it"
        );
      }
    }
  );
};
controller._checkId = function (id, callback) {
  fs.readFile(`./../main/data/users/${id}.txt`, "utf8", function (err, _) {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};
controller.deleteUser = function (buffer, callback) {
  let parsedBuffer = helpers.parseJsonToObject(buffer);
  if (parsedBuffer.id) {
    controller._checkId(parsedBuffer.id, function (boolean) {
      if (boolean) {
        fs.unlink(
          `./../main/data/users/${parsedBuffer.id}.txt`,
          function (err) {
            if (!err) {
              callback(false, "your file is succesfully deleted!");
            } else {
              callback("we can't delete your file");
            }
          }
        );
      } else {
        callback("your id is wrong");
      }
    });
  }
};
controller.menu = function (callback) {
  fs.readFile("./../main/data/menu/menu.txt", "utf8", function (err, data) {
    if (!err && data) {
      callback(false, data);
    } else {
      callback(err);
    }
  });
};
module.exports = controller;

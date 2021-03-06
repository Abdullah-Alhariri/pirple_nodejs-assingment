// This file is for storing and editing data

// 2 Dependencies
const fs = require("fs");
const path = require("path");

// Codntainer for this module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// Write data to a file
lib.create = function (dir, file, data, callback) {
  // Open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // Convert data to string
        const stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("error closing new file");
              }
            });
          } else {
            callback("error writing to new file");
          }
        });
      } else {
        callback("could not create new file, it may already exist");
      }
    }
  );
};

// Read data from file
lib.read = function (dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", (err, data) => {
    if (!err && data) {
      const parsedData = JSON.parse(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

// Update data inside a file
lib.update = function (dir, file, data, callback) {
  // OPen the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Converting the data to sring
        const stringData = JSON.stringify(data);
        // Truncate th file
        fs.truncate(fileDescriptor, (err) => {
          if (!err) {
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing the file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("truncate error");
          }
        });
      } else {
        callback("could not open the file for updating, it may not exist yet ");
      }
    }
  );
};

// Delete a file
lib.delete = function (dir, file, callback) {
  // Unlink the file
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("error deleting file");
    }
  });
};

// List all the items in a directory
lib.list = function (dir, callback) {
  fs.readdir(lib.baseDir + dir + "/", function (err, data) {
    if (!err && data && data > 0) {
      const trimmerFileNames = [];
      data.forEach(function (fileName) {
        trimmerFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, strimmerFileNames);
    } else {
      callback(err, data);
    }
  });
};

// Export the module
module.exports = lib;

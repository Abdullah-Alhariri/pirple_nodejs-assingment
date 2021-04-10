var _data = require("./data");
// var helpers = require("./helpers");
var config = require("./config");

var handlers = {};

handlers.ping = function (data, callback) {
  callback(200);
};

handlers.notFound = function (data, callback) {
  callback(404);
};

handlers._users = {};

// Required data: email , streetAddress
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out
  var email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;
  /*
    var email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0 &&
    data.payload.email.includes('@')
      ? data.payload.email.trim()
      : false;
  */
  var streetAddress =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  if (email && streetAddress) {
    // Make sure the user doesnt already exist
    _data.read("users", phone, function (err, data) {
      if (err) {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if (hashedPassword) {
          var userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            tosAgreement: true,
          };

          // Store the user
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password." });
        }
      } else {
        // User alread exists
        callback(400, {
          Error: "A user with that phone number already exists",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Export the handlers
module.exports = handlers;

// const config = require("./config");
// const crypto = require("crypto");
// const https = require("https");
// const querystring = require("querystring");

const helpers = {};
helpers.parseJsonToObject = function (str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

helpers.formatPayload = (buffer) =>
  Object.fromEntries(
    buffer.split("&").map((cur) => [cur.split("=")[0], cur.split("=")[1]])
  );

helpers.createRandomString = function (strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (i = 1; i <= strLength; i++) {
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};

module.exports = helpers;

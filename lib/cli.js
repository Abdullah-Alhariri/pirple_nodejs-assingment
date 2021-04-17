/**
 * CLI
 */
const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
const e = new _events();
const os = require("os");
const v8 = require("v8");
const _data = require("./data");
const helpers = require("./helpers");
const menu = require("./../data/menu/menu.txt");
const fs = require("fs");

const cli = {};
cli.responders = {};

e.on("man", function () {
  cli.responders.man();
});
e.on("help", function () {
  e.emit("man");
});
e.on("exit", function () {
  process.exit(0);
});
e.on("menu", function () {
  cli.responders.menu();
});
e.on("user", function (str) {
  cli.responders.user(str);
});
e.on("stats", function () {
  cli.responders.stats();
});
cli.responders.stats = function () {
  // prettier-ignore
  // Compile an object of stats
  var stats = {
    'Load Average' : os.loadavg().join(' '),
    'CPU Count' : os.cpus().length,
    'Free Memory' : os.freemem(),
    'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime' : os.uptime()+' Seconds'
  };
  cli.horizontalLine();
  cli.centered("SYSTEM STATISTICS");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Log out each stat
  for (var key in stats) {
    if (stats.hasOwnProperty(key)) {
      var value = stats[key];
      var line = "      \x1b[33m " + key + "      \x1b[0m";
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  // Footer for the stats
  cli.verticalSpace();
  cli.horizontalLine();
};

cli.responders.user = function (str) {
  const userId = str.split("--")[1];
  if (str.split("--").length === 2 && userId.length == 20) {
    fs.readFile(`./data/users/${userId}.json`, "utf-8", (err, data) => {
      if (err) return;
      cli.horizontalLine();
      cli.centered(`user data for '${userId}'`);
      cli.horizontalLine();
      cli.verticalSpace(2);
      console.log(data);
      cli.horizontalLine();
    });
  }
};

cli.responders.menu = function () {
  fs.readFile("./../main/data/menu/menu.txt", "utf-8", function (err, data) {
    if (err) return;
    cli.horizontalLine();
    cli.centered("menu");
    cli.horizontalLine();
    cli.verticalSpace(2);
    console.log(data);
    cli.horizontalLine();
  });
};

cli.responders.man = function () {
  const commands = {
    exit: "Kill the CLI (and the rest of the application)",
    man: "Show this help page",
    help: 'Alias of the "man" command',
    stats:
      "Get statistics on the underlying operating system and resource utilization",
    menu: "Show a list of our menu",
    "user --{userId}": "Show details of a specified user (Id is required!)",
  };
  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = "      \x1b[33m " + key + "      \x1b[0m";
      const padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);
  cli.horizontalLine();
};

cli.verticalSpace = function (lines) {
  lines = typeof lines == "number" && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log("");
  }
};

cli.horizontalLine = function () {
  // Get the available screen size
  const width = process.stdout.columns;
  let line = "";
  for (i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

cli.centered = function (str = "") {
  const width = process.stdout.columns;

  // Calculate the left padding there should be
  const leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  let line = "";
  for (i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;
  console.log(line);
};

cli.processInput = function (str = false) {
  if (!str) return;

  // prettier-ignore
  const uniqueInputs = [
    "man",
    "help",
    "exit",
    "menu",
    "user",
    "stats"
  ];

  let matchFound = false;
  uniqueInputs.some((input) => {
    if (str.toLowerCase().indexOf(input) > -1) {
      matchFound = true;
      e.emit(input, str);
      return true;
    }
  });
  if (matchFound) return;
  console.log("Sorry, try again");
};

cli.init = function () {
  console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  });
  _interface.prompt();
  _interface.on("line", (str) => {
    cli.processInput(str);
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on("close", function () {
    process.exit(0);
  });
};

// Export the module
module.exports = cli;

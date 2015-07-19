var async = require("async");
var lodash = require("lodash");
var transformer = require("./transformer.js");
var phidgets = require("./phidgets.js");

function sendString(string, delay, callback) {

  var waterfallFunctions = [];

  //Push open function
  waterfallFunctions.push(
    function (next) {
      phidgets.open(next);
    }
  );

  //Push clear pins function
  waterfallFunctions.push(
    function (next) {
      phidgets.setPin([0, 1, 2, 3], false, next);
    }
  );

  //Push pins functions
  var pins = transformer.stringToPins(string);
  pinWaterfallFunctions = [];
  var pinWaterfallFunctions = lodash.map(pins, function (pin) {
    return function (next) {
      async.waterfall([
        function (next2) {
          console.log(pin.toString());
          phidgets.setPin(pin, true, next2);
        },
        function (next2) {
          setTimeout(next2, delay);
        },
        function (next2) {
          phidgets.setPin([0, 1, 2, 3], false, next2);
        },
        function (next2) {
          setTimeout(next2, delay);
        },
      ], next);
    };
  });

  waterfallFunctions = waterfallFunctions.concat(pinWaterfallFunctions);

  //Push close function
  waterfallFunctions.push(
    function (next) {
      phidgets.close(next);
    }
  );

  //Run, baby
  async.waterfall(waterfallFunctions, callback);

}

var string = "Hello World!";
var delay = 350;
sendString(string, delay, function (error) {
  if (error) {
    console.log("I couldn't send the string ('" + error + "').");
    return process.exit(0);
  }
  console.log("I sent the string!");
});
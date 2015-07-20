var async = require("async");
var lodash = require("lodash");
var transformer = require("./transformer.js");
var phidgets = require("./phidgets.js");

var exports = module.exports = {};


exports.sendBytes = function(bytes, delay, callback) {

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
  var pins = transformer.bytesToPins(bytes);
  pinWaterfallFunctions = [];
  var pinWaterfallFunctions = lodash.map(pins, function (pin) {
    return function (next) {
      async.waterfall([
        function (next2) {
          console.log("SENT PIN: " + pin.toString());
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


exports.sendString = function (string, delay, callback) {
  var bytes = [];
  var i;
  for (i = 0; i < string.length; i++) {
    bytes[i] = string.charCodeAt(i);
  }
  return this.sendBytes(bytes, delay, callback);
}
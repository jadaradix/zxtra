var phidgets = require("phidgets");
var sprintf = require("sprintf-js").sprintf;
var pik = new phidgets.PhidgetInterfaceKit();

var exports = module.exports = {};


exports.open = function (callback) {
  var tidyUp = function() {
    pik.removeListener("opened", openedEvent);
    pik.removeListener("timeout", timeoutEvent);
    pik.removeListener("error", errorEvent);
  }
  var openedEvent = function (emitter) {
    tidyUp();
    return callback(false);
  };
  var timeoutEvent = function (emitter) {
    tidyUp();
    return callback("Timeout was emitted");
  };
  var errorEvent = function (emitter) {
    tidyUp();
    return callback("Error was emitted");
  };
  pik.on("opened", openedEvent);
  pik.on("timeout", timeoutEvent);
  pik.on("error", errorEvent);
  pik.open();
}


exports.close = function (callback) {
  pik.on("closed", function (emitter) {
    return callback(false);
  });
  return pik.close();
}


exports.setPin = function (index, value, callback) {
  var tidyUp = function() {
    pik.removeListener("output", outputEvent);
    pik.removeListener("error", errorEvent);
  }
  var outputEvent = function (emitter) {
    tidyUp();
    return callback(false);
  };
  var errorEvent = function (emitter) {
    tidyUp();
    return callback(sprintf("Error was emitted (index %d, value %d)", index, value));
  };
  pik.on("output", outputEvent);
  pik.on("error", errorEvent);
  pik.setOutput(index, value);
}
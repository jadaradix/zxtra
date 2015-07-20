var lodash = require("lodash");

var exports = module.exports = {};


exports.stringPad = function (thing) {
  return lodash.padRight(thing.toString(), 12);
}


exports.bytesToPinSets = function (bytes) {
  var pinSets = [];
  var i;
  for (i = 0; i < bytes.length; i++) {
    var binaryCode = bytes[i].toString(2);
    binaryCode = lodash.padLeft(binaryCode, 8, "0");
    var pins = [];
    var id;
    for (id = 0; id < (binaryCode.length / 2); id++) {
      var idBits = binaryCode.substring(id * 2, (id * 2) + 2);
      pins.push(parseInt(idBits, 2));
    }
    pinSets.push(pins);
    var consoleOutput = "";
    consoleOutput += this.stringPad(i);
    consoleOutput += this.stringPad(bytes[i]);
    consoleOutput += this.stringPad(binaryCode.toString());
    consoleOutput += pins.toString();
    console.log(consoleOutput);
  }
  return pinSets;
}


exports.bytesToPins = function (bytes) {
  return lodash.flatten(this.bytesToPinSets(bytes));
}
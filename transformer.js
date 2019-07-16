const { flatten, padLeft, padRight } = require("lodash")

const stringPad = (thing) => padRight(thing.toString(), 12)

const bytesToPinSets = (bytes) => {
  const pinSets = []
  for (let i = 0; i < bytes.length; i++) {
    let binaryCode = bytes[i].toString(2)
    binaryCode = padLeft(binaryCode, 8, "0")
    const pins = []
    for (let id = 0; id < (binaryCode.length / 2); id++) {
      const idBits = binaryCode.substring(id * 2, (id * 2) + 2)
      pins.push(parseInt(idBits, 2))
    }
    pinSets.push(pins)
    let consoleOutput = ""
    consoleOutput += stringPad(i)
    consoleOutput += stringPad(bytes[i])
    consoleOutput += stringPad(binaryCode.toString())
    consoleOutput += pins.toString()
    console.log(consoleOutput)
  }
  return pinSets
}

const bytesToPins = (bytes) => flatten(bytesToPinSets(bytes))

module.exports = {
  bytesToPins
}

// events/esp32Emitter.js
const EventEmitter = require('events');

class Esp32Emitter extends EventEmitter {}

module.exports = new Esp32Emitter();

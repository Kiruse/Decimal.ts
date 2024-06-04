const util = require('util');

module.exports = (Decimal) => {
  Decimal.prototype[util.inspect.custom] = function() {
    return `\x1b[33m${this}\x1b[0m`;
  };
}

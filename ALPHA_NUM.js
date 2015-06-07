//---------------------------------------------------------------------
// ALPHA_NUM
//---------------------------------------------------------------------

function ALPHA_NUM(data) {
  this.mode = QRMode.MODE_ALPHA_NUM;
  this.data = data;
}

/** Convert UTF-8 to alphanumeric code
* @param {String} code
* @return {Number}
*/
ALPHA_NUM.prototype.getCode = function(code) {
  var codes = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
  var index = codes.indexOf(code);
  if (index < 0) {
    throw new Error('Invalid character: "' + code + '"');
  }
  return index;
};

/**
* Returns bit length of buffer
* @param {Object} buffer
* @return {Number} length in bits
*/
ALPHA_NUM.prototype.getLength = function(buffer) {
  return this.data.length;
};

/**
* Encode string in buffer
* @param {Object} buffer
*/
ALPHA_NUM.prototype.write = function(buffer) {
  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i + 1]) {
      buffer.put(
        (45 * this.getCode(this.data[i])) +
        this.getCode(this.data[i + 1]),
        11
      );
    } else {
      buffer.put(this.getCode(this.data[i]), 6);
    }
    i++;
  }
};

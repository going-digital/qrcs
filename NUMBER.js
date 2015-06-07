//---------------------------------------------------------------------
// NUMBER
//---------------------------------------------------------------------

function NUMBER(data) {
  this.mode = QRMode.MODE_NUMBER;
  this.data = data;
}

/**
* Convert UTF-8 to numeric code
* @param {String} chars
* @return {Number}
*/
NUMBER.prototype.getCode = function(chars) {
  var index = parseInt(chars, 10);
  if (isNaN(index)) {
    throw new Error('Invalid character: "' + chars + '');
  }
  return index;
};

/**
* Return bits for encoding digits
* @param {Number} length
* @return {Number} bits
*/
NUMBER.prototype.getBitLen = function(length) {
  var NUMBER_LENGTH = {
    3: 10,
    2: 7,
    1: 4
  };
  return NUMBER_LENGTH[length];
};

/**
* Returns bit length of buffer
* @param {Object} buffer
* @return {Number} length in bits
*/
NUMBER.prototype.getLength = function(buffer) {
  return this.data.length;
};

/**
* Encode string in buffer
* @param {Object} buffer
*/
NUMBER.prototype.write = function(buffer) {
  for (var i = 0; i < this.data.length; i++) {

    var chars = this.data[i];
    if (this.data[i + 1]) {
      chars += this.data[i + 1];
    }
    if (this.data[i + 2]) {
      chars += this.data[i + 2];
    }

    var bitLength = this.getBitLen(chars.length);
    buffer.put(this.getCode(chars), bitLength);

    i++;
    i++;
  }
};

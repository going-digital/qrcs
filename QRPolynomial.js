//---------------------------------------------------------------------
// QRPolynomial
//---------------------------------------------------------------------

function QRPolynomial(num, shift) {

  if (num.length === undefined) {
    throw new Error(num.length + '/' + shift);
  }

  var offset = 0;

  while (offset < num.length && num[offset] === 0) {
    offset++;
  }

  this.num = new Array(num.length - offset + shift);
  for (var i = 0; i < num.length - offset; i++) {
    this.num[i] = num[i + offset];
  }
}

/** Placeholder comment
* @param {Number} index
* @return {Number}
*/
QRPolynomial.prototype.get = function(index) {
  return this.num[index];
};

/** Placeholder comment
* @return {Number}
*/
QRPolynomial.prototype.getLength = function() {
  return this.num.length;
};

/** Placeholder comment
* @param {Object} e
* @return {Object}
*/
QRPolynomial.prototype.multiply = function(e) {

  var num = new Array(this.getLength() + e.getLength() - 1);

  for (var i = 0; i < this.getLength(); i++) {
    for (var j = 0; j < e.getLength(); j++) {
      num[i + j] ^= QRMath.gexp(
        QRMath.glog(this.get(i)) +
        QRMath.glog(e.get(j))
      );
    }
  }
  return new QRPolynomial(num, 0);
};

/** Placeholder comment
* @param {Object} e
* @return {Object}
*/
QRPolynomial.prototype.mod = function(e) {
  if (this.getLength() - e.getLength() < 0) {
    return this;
  }
  var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
  var num = new Array(this.getLength());
  var i;
  for (i = 0; i < this.getLength(); i++) {
    num[i] = this.get(i);
  }
  for (i = 0; i < e.getLength(); i++) {
    num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
  }
  // recursive call
  return new QRPolynomial(num, 0).mod(e);
};

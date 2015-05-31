//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase, URL: http://www.d-project.com/
// Copyright (c) 2013 Jan Antala, URL: http://www.janantala.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// QRCode
//---------------------------------------------------------------------

function QRCode(typeNumber, errorCorrectLevel, inputMode) {
  this.typeNumber = typeNumber;
  this.errorCorrectLevel = errorCorrectLevel;
  this.inputMode = inputMode;
  this.modules = null;
  this.moduleCount = 0;
  this.dataCache = null;
  this.dataList = [];
}

QRCode.prototype.addData = function(data) {
  var newData;
  if (this.inputMode === "NUMBER") {
    newData = new NUMBER(data);
  } else if (this.inputMode === "ALPHA_NUM") {
    newData = new ALPHA_NUM(data);
  } else {
    newData = new QR8bitByte(data);
  }
  this.dataList.push(newData);
  this.dataCache = null;
};

QRCode.prototype.isDark = function(row, col) {
  if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
    throw new Error(row + "," + col);
  }
  return this.modules[row][col];
};

QRCode.prototype.getModuleCount = function() {
  return this.moduleCount;
};

QRCode.prototype.symbolCapacity = function(version, errorCorrectLevel) {
  var rsBlocks = QRRSBlock.getRSBlocks(version, errorCorrectLevel);
  var totalDataCount = 0;
  for (i=0; i < rsBlocks.length; i++) {
    totalDataCount += rsBlocks[i].dataCount;
  }
  return totalDataCount*8;
};

QRCode.prototype.make = function() {
  var i;
  // Calculate automatically typeNumber if provided is < 1
  if (this.typeNumber < 1) {
    /* New symbol sizer - finds smallest symbol, and highest ECC setting */
    // Size 1 to 40, level L
    for (var typeNumber = 1; typeNumber <= 40; typeNumber++) {
      if (typeNumber == 1 || typeNumber == 10 || typeNumber == 27) {
        // Calculate at versions 1, 10 and 27 where encoding changes
        var buffer = new QRBitBuffer();
        for (i=0; i < this.dataList.length; i++) {
          var data = this.dataList[i];
          buffer.put(data.mode, 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
          data.write(buffer);
        }
        var dataSize = buffer.getLengthInBits();
      }
      var symbolSize = this.symbolCapacity(typeNumber, this.errorCorrectLevel);
      if (dataSize <= symbolSize) {
        break;
      }
    }
    this.typeNumber = typeNumber;

    // Drop level HQML until fits
    var eccSizes = [
      QRErrorCorrectLevel.H,
      QRErrorCorrectLevel.Q,
      QRErrorCorrectLevel.M,
      QRErrorCorrectLevel.L
    ];
    for (var i=0; i < eccSizes.length; i++) {
      this.errorCorrectLevel = eccSizes[i];
      var symbolSize = this.symbolCapacity(typeNumber, this.errorCorrectLevel);
      if (dataSize <= symbolSize) {
        break;
      }
    }
    console.log(this.typeNumber+"MLHQ"[this.errorCorrectLevel]);

    /* Old symbol sizer
    var typeNumber = 1;

    for (typeNumber = 1; typeNumber < 40; typeNumber++) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
      var buffer = new QRBitBuffer();
      var totalDataCount = 0;
      for (i = 0; i < rsBlocks.length; i++) {
        totalDataCount += rsBlocks[i].dataCount;
      }
      for (i = 0; i < this.dataList.length; i++) {
        var data = this.dataList[i];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      if (buffer.getLengthInBits() <= totalDataCount * 8) {
        break;
      }
    }
    this.typeNumber = typeNumber;
    */
  }
  this.makeImpl(false, this.getBestMaskPattern());
};

QRCode.prototype.makeImpl = function(test, maskPattern) {
  this.moduleCount = this.typeNumber * 4 + 17;
  this.modules = new Array(this.moduleCount);
  for (var row = 0; row < this.moduleCount; row++) {
    this.modules[row] = new Array(this.moduleCount);
    for (var col = 0; col < this.moduleCount; col++) {
      this.modules[row][col] = null; //(col + row) % 3;
    }
  }
  this.setupPositionProbePattern(0, 0);
  this.setupPositionProbePattern(this.moduleCount - 7, 0);
  this.setupPositionProbePattern(0, this.moduleCount - 7);
  this.setupPositionAdjustPattern();
  this.setupTimingPattern();
  this.setupTypeInfo(test, maskPattern);

  if (this.typeNumber >= 7) {
    this.setupTypeNumber(test);
  }

  if (this.dataCache === null) {
    this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
  }

  this.mapData(this.dataCache, maskPattern);
};

QRCode.prototype.setupPositionProbePattern = function(row, col) {
  for (var r = -1; r <= 7; r++) {

    if (row + r <= -1 || this.moduleCount <= row + r) {
      continue;
    }

    for (var c = -1; c <= 7; c++) {

      if (col + c <= -1 || this.moduleCount <= col + c) {
        continue;
      }

      if ((0 <= r && r <= 6 && (c === 0 || c === 6)) || (0 <= c && c <= 6 && (r === 0 || r === 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
        this.modules[row + r][col + c] = true;
      } else {
        this.modules[row + r][col + c] = false;
      }
    }
  }
};

QRCode.prototype.getBestMaskPattern = function() {

  var minLostPoint = 0;
  var pattern = 0;

  for (var i = 0; i < 8; i++) {

    this.makeImpl(true, i);

    var lostPoint = QRUtil.getLostPoint(this);

    if (i === 0 || minLostPoint > lostPoint) {
      minLostPoint = lostPoint;
      pattern = i;
    }
  }

  return pattern;
};

QRCode.prototype.createMovieClip = function(targetMc, instanceName, depth) {

  var qrMc = targetMc.createEmptyMovieClip(instanceName, depth);
  var cs = 1;

  this.make();

  for (var row = 0; row < this.modules.length; row++) {

    var y = row * cs;

    for (var col = 0; col < this.modules[row].length; col++) {

      var x = col * cs;
      var dark = this.modules[row][col];

      if (dark) {
        qrMc.beginFill(0, 100);
        qrMc.moveTo(x, y);
        qrMc.lineTo(x + cs, y);
        qrMc.lineTo(x + cs, y + cs);
        qrMc.lineTo(x, y + cs);
        qrMc.endFill();
      }
    }
  }

  return qrMc;
};

QRCode.prototype.setupTimingPattern = function() {

  for (var r = 8; r < this.moduleCount - 8; r++) {
    if (this.modules[r][6] !== null) {
      continue;
    }
    this.modules[r][6] = (r % 2 === 0);
  }

  for (var c = 8; c < this.moduleCount - 8; c++) {
    if (this.modules[6][c] !== null) {
      continue;
    }
    this.modules[6][c] = (c % 2 === 0);
  }
};

QRCode.prototype.setupPositionAdjustPattern = function() {
    var pos = QRUtil.getPatternPosition(this.typeNumber);
    for (var i = 0; i < pos.length; i++) {
      for (var j = 0; j < pos.length; j++) {
        var row = pos[i];
        var col = pos[j];
        if (this.modules[row][col] !== null) {
          continue;
        }
        for (var r = -2; r <= 2; r++) {
          for (var c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  },

  QRCode.prototype.setupTypeNumber = function(test) {

    var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
    var mod;
    var i;

    for (i = 0; i < 18; i++) {
      mod = (!test && ((bits >> i) & 1) === 1);
      this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
    }

    for (i = 0; i < 18; i++) {
      mod = (!test && ((bits >> i) & 1) === 1);
      this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  };

QRCode.prototype.setupTypeInfo = function(test, maskPattern) {

  var data = (this.errorCorrectLevel << 3) | maskPattern;
  var bits = QRUtil.getBCHTypeInfo(data);
  var mod;
  var i;

  // vertical
  for (i = 0; i < 15; i++) {

    mod = (!test && ((bits >> i) & 1) === 1);

    if (i < 6) {
      this.modules[i][8] = mod;
    } else if (i < 8) {
      this.modules[i + 1][8] = mod;
    } else {
      this.modules[this.moduleCount - 15 + i][8] = mod;
    }
  }

  // horizontal
  for (i = 0; i < 15; i++) {

    mod = (!test && ((bits >> i) & 1) === 1);

    if (i < 8) {
      this.modules[8][this.moduleCount - i - 1] = mod;
    } else if (i < 9) {
      this.modules[8][15 - i - 1 + 1] = mod;
    } else {
      this.modules[8][15 - i - 1] = mod;
    }
  }

  // fixed module
  this.modules[this.moduleCount - 8][8] = (!test);

};

QRCode.prototype.mapData = function(data, maskPattern) {

  var inc = -1;
  var row = this.moduleCount - 1;
  var bitIndex = 7;
  var byteIndex = 0;

  for (var col = this.moduleCount - 1; col > 0; col -= 2) {
    if (col === 6) {
      col--;
    }
    while (true) {
      for (var c = 0; c < 2; c++) {
        if (this.modules[row][col - c] === null) {
          var dark = false;
          if (byteIndex < data.length) {
            dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
          }
          var mask = QRUtil.getMask(maskPattern, row, col - c);
          if (mask) {
            dark = !dark;
          }
          this.modules[row][col - c] = dark;
          bitIndex--;
          if (bitIndex === -1) {
            byteIndex++;
            bitIndex = 7;
          }
        }
      }
      row += inc;
      if (row < 0 || this.moduleCount <= row) {
        row -= inc;
        inc = -inc;
        break;
      }
    }
  }
};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
  var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
  var buffer = new QRBitBuffer();
  var i;
  for (i = 0; i < dataList.length; i++) {
    var data = dataList[i];
    buffer.put(data.mode, 4);
    buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
    data.write(buffer);
  }
  var totalDataCount = 0;
  for (i = 0; i < rsBlocks.length; i++) {
    totalDataCount += rsBlocks[i].dataCount;
  }

  if (buffer.getLengthInBits() > totalDataCount * 8) {
    throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
  }
  if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
    buffer.put(0, 4);
  }
  while (buffer.getLengthInBits() % 8 !== 0) {
    buffer.putBit(false);
  }
  while (true) {
    if (buffer.getLengthInBits() >= totalDataCount * 8) {
      break;
    }
    buffer.put(QRCode.PAD0, 8);
    if (buffer.getLengthInBits() >= totalDataCount * 8) {
      break;
    }
    buffer.put(QRCode.PAD1, 8);
  }
  return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {
  var offset = 0;
  var maxDcCount = 0;
  var maxEcCount = 0;
  var dcdata = new Array(rsBlocks.length);
  var ecdata = new Array(rsBlocks.length);
  var i;
  var r;
  for (r = 0; r < rsBlocks.length; r++) {
    var dcCount = rsBlocks[r].dataCount;
    var ecCount = rsBlocks[r].totalCount - dcCount;
    maxDcCount = Math.max(maxDcCount, dcCount);
    maxEcCount = Math.max(maxEcCount, ecCount);
    dcdata[r] = new Array(dcCount);
    for (i = 0; i < dcdata[r].length; i++) {
      dcdata[r][i] = 0xff & buffer.buffer[i + offset];
    }
    offset += dcCount;
    var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
    var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
    var modPoly = rawPoly.mod(rsPoly);
    ecdata[r] = new Array(rsPoly.getLength() - 1);
    for (i = 0; i < ecdata[r].length; i++) {
      var modIndex = i + modPoly.getLength() - ecdata[r].length;
      ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
    }
  }
  var totalCodeCount = 0;
  for (i = 0; i < rsBlocks.length; i++) {
    totalCodeCount += rsBlocks[i].totalCount;
  }
  var data = new Array(totalCodeCount);
  var index = 0;
  for (i = 0; i < maxDcCount; i++) {
    for (r = 0; r < rsBlocks.length; r++) {
      if (i < dcdata[r].length) {
        data[index++] = dcdata[r][i];
      }
    }
  }
  for (i = 0; i < maxEcCount; i++) {
    for (r = 0; r < rsBlocks.length; r++) {
      if (i < ecdata[r].length) {
        data[index++] = ecdata[r][i];
      }
    }
  }
  return data;
};

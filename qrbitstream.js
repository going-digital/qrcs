
function moduleSize(mode,length, version) {
  var size = 4;
  if (mode=='ALPHA_NUM') {
    size += version < 9 ? 9 : version < 27 ? 11 : 13;
    size += Math.ceil(length * 11 / 2);
    // 11 bits per pair
    // 6 bits for one character
  } else if (mode=='NUMBER') {
    size += version < 9 ? 10 : version < 27 ? 12 : 14;
    size += Math.ceil(length * 10 / 3);
    // 10 bits per 3 characters
    // 7 bits per 2 characters
    // 4 bits per character
  } else {
    size += version < 9 ? 8 : 16;
    size += length * 8;
    // Always 8 bits per character
  }
  return size;
}

function minType(string) {
  if (string.match(/^[0-9]+$/)) {
    return 'NUMBER';
  }
  if (string.match(/^[A-Z0-9 $%*+\-./:]+$/) {
    return 'ALPHA_NUM';
  }
}

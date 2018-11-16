const Fs = require('fs');
const Path = require('path');
const parse = require('./parse');

module.exports = (path, file) => {
  const fname = Path.join(path, file);
  let ret = false;

  try {
    const data = Fs.readFileSync(fname, 'utf-8');

    ret = parse(data);
  } catch(err) {
    // TODO
  }

  return ret;
}

const JSON = require('json5');

module.exports = (data) => {
  let result;

  try {
    result = JSON.parse(data);
  } catch (e) {
    result = false;
  }

  return result;
}

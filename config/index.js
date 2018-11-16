const woxAdmin = require('./wox-admin');      // 后台项目
const woxH5 = require('./wox-h5');            // 移动项目

module.exports = {
  tasks: {
    ...woxAdmin,
    ...woxH5,
  }
};

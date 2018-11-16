/**
 * 脚本执行器
 */
const Os = require('os');
const Fs = require('fs');
const Path = require('path');
const Tmp = require('temp');
const execFile = require('child_process').execFile;
const logger = require('../utils/logger');
const { info, error } = logger;
let idx = 0;

Tmp.track();

module.exports = (cmds) => {
  if (cmds.length > 0) {
    Tmp.mkdir({dir: Os.tmpdir(), prefix: 'gitlabhook.'}, function(err, path) {
      if (err) {
        error(err);
        return;
      }
      info(`Tempdir: ${path}`);
      execute(cmds, path);
    });
  }
}

function execute(cmds, path) {
  if (idx == cmds.length) {
    info(`Remove working directory: ${path}`);
    idx = 0;
    Tmp.cleanup();
    return;
  }

  const fname = Path.join(path, 'task-' + pad(idx, 3));
  Fs.writeFile(fname, cmds[idx], function(err) {
    if (err) {
      error(`File creation error: ${err}`);
      return;
    }
    info(`File created: ${fname}`);
    execFile('/bin/sh', [ fname ], { cwd: path, env: process.env }, function(err, stdout, stderr) {
      if (err) {
        error(`Exec error: ${err}`);
      } else {
        info(`Executed: /bin/sh ${fname}`);
        process.stdout.write(stdout);
      }
      process.stderr.write(stderr);
      idx++;
      execute(cmds, path);
    });
  });
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

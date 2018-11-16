/**
 * gitlab hook core
 * fork from https://github.com/rolfn/node-gitlab-hook
 */

const Http = require('http');
const Util = require('util');
const { format, inspect, isArray } = Util;
const logger = require('../utils/logger');
const { info, error } = logger;
const parse = require('../utils/parse');
const readConfigFile = require('../utils/read-config-file');
const dataParser = require('./data-parser');                        // 解析 gitlab 接口的数据
const gitCmdsGenerator = require('./git-cmds-generator');           // 生成需要执行的 git 命令
const executeCmdsGenerator = require('./execute-cmds-generator');   // 生成需要执行的操作命令
const cmdsExecutor = require('./cmds-executor');                    // 命令执行器

const GitLabHook = function(_options, _callback) {
  if (!(this instanceof GitLabHook)) {
    return new GitLabHook(_options, _callback);
  }

  let callback = null;
  let options = null;
  if (typeof _options === 'function') {
    callback = _options;
  } else {
    callback = _callback;
    options =  _options;
  }
  options = options || {};
  this.configFile = 'config/index.js';
  this.configPathes = '.';
  this.port = options.port || 3420;
  this.host = options.host || '0.0.0.0';
  this.callback = callback;

  let active = false;
  if (typeof callback == 'function') {
    active = true;
  } else {
    cfg = readConfigFile(this.configPathes, this.configFile);
    if (cfg) {
      info('loading config file: ' + this.configFile);
      info('config file:\n' + inspect(cfg));
      for (let i in cfg) {
        if (i == 'tasks' && typeof cfg.tasks == 'object' && Object.keys(cfg.tasks).length) {
          this.tasks = cfg.tasks;
          active = true;
        } else {
          this[i] = cfg[i];
        }
      }
    } else {
      error('can\'t read config file: ', this.configFile);
    }
  }

  if (active) {
    this.server = Http.createServer(serverHandler.bind(this));
  }
};

GitLabHook.prototype.listen = function(callback) {
  const self = this;

  if (typeof self.server !== 'undefined') {
    self.server.listen(self.port, self.host, function () {
      info(format('listening for github events on %s:%d', self.host, self.port));

      if (typeof callback === 'function') {
        callback();
      }
    });
  } else {
    info('server disabled');
  }
};

function reply(statusCode, res) {
  const headers = {
    'Content-Length': 0
  };

  res.writeHead(statusCode, headers);
  res.end();
}

function executeShellCmds(self, address, data) {
  const repo = data.project.path_with_namespace;
  const task = self.tasks[repo];
  const taskTemp = task || { versionControl: true };
  const versionControl = 'versionControl' in taskTemp ? taskTemp['versionControl'] : true;
  const formatData = dataParser(data);
  const { isBranchDelete } = formatData;
  const { gitCmds, version, master } = gitCmdsGenerator(formatData, versionControl);

  if (
    (versionControl && !version) ||        // 如果开启版本控制，但是不符合 `x.y.z` 的版本号规则，则不进入命令执行阶段
    (isBranchDelete && !version) ||        // 如果删除无版本分支 则不进入命令执行阶段
    (!master && !version)                  // 如果不是 master 提交，且没有版本号， 则不进入命令执行阶段
  ) {
    return;
  }

  const cmds = executeCmdsGenerator(task, formatData, gitCmds, version);

  cmdsExecutor(cmds);
}

function serverHandler(req, res) {
  const self = this;
  const buffer = [];
  const remoteAddress = req.ip || req.socket.remoteAddress || req.socket.socket.remoteAddress;
  let bufferLength = 0;
  let failed = false;

  req.on('data', function (chunk) {
    if (failed) {
      return;
    }

    buffer.push(chunk);
    bufferLength += chunk.length;
  });

  req.on('end', function (chunk) {
    if (failed) {
      return;
    }

    if (chunk) {
      buffer.push(chunk);
      bufferLength += chunk.length;
    }

    info(format('received %d bytes from %s\n\n', bufferLength, remoteAddress));

    const data = parse(Buffer.concat(buffer, bufferLength).toString());

    // invalid json
    if (!data || !data.repository || !data.repository.name) {
      error(format('received invalid data from %s, returning 400\n\n', remoteAddress));
      return reply(400, res);
    }

    const repo = data.project.path_with_namespace;

    reply(200, res);

    info(format('got event on %s:%s from %s\n\n', repo, data.ref, remoteAddress));
    info(inspect(data, { showHidden: true, depth: 10 }) + '\n\n');

    if (typeof self.callback == 'function') {
      self.callback(data);
    } else {
      executeShellCmds(self, remoteAddress, data);
    }
  });

  // 405 if the method is wrong
  if (req.method !== 'POST') {
    error(format('got invalid method from %s, returning 405', remoteAddress));
    failed = true;
    return reply(405, res);
  }

}

module.exports = GitLabHook;

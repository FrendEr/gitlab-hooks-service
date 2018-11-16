/**
 * 自动创建项目目录
 *
 * 通过获取 `config` 目录下的项目配置信息，判断服务器是否已经存在对应的目录，如果没有则创建源代码仓库目录以及部署目录
*/
const cmdsExecutor = require('./cmds-executor');
const cfg = require('../config');
let tasks = null;
const cmds = [];

for (let i in cfg) {
  if (i == 'tasks' && typeof cfg.tasks == 'object' && Object.keys(cfg.tasks).length) {
    tasks = cfg.tasks;
  }
}

if (!tasks) {
  return;
}

for (let t in tasks) {
  const task = tasks[t];
  const repoName = task['name'];              // 项目名
  const gitUrl = task['git-url'];             // git 仓库地址
  const needInit = task['needInit'];          // 是否需要初始化，针对新增的项目使用
  const daily = task['daily'];                // 测试环境相关参数
  const publish = task['publish'];            // 生产环境相关参数

  if (!needInit) {
    continue;
  }

  const cmdStrDaily = cmdStrGenerator(repoName, gitUrl, daily);
  const cmdStrPublish = cmdStrGenerator(repoName, gitUrl, publish);

  cmds.push(cmdStrDaily, cmdStrPublish);

  // 初始化测试环境命令
  // ssh frend@192.168.0.4 '
  //  mkdir -p /data/git-dir && cd /data/git-dir && git clone 1.git && cd /data/deploy-dir && mkdir -p 1 &&
  //  mkdir -p /data/git-dir && cd /data/git-dir && git clone 2.git && cd /data/deploy-dir && mkdir -p 2 &&
  // '
  //
  // 初始化生产环境命令
  // ssh -p 60886 frend@111.101.2.10 '
  //  mkdir -p /data/git-dir && cd /data/git-dir && git clone 1.git && cd /data/deploy-dir && mkdir -p 1 &&
  //  mkdir -p /data/git-dir && cd /data/git-dir && git clone 2.git && cd /data/deploy-dir && mkdir -p 2 &&
  // '
  //
  // 抽象命令
  // ${sshHost} '
  //  mkdir -p ${gitRepo} && cd ${gitRepo} && git clone ${gitUrl} && cd ${deployDir} && mkdir -p repoName} &&
  // '

  /**
   * 参数配置示例
   {
     "tasks": {
       "firebug/wox-admin/data-manager/formula": {
         "versionControl": false,
         "name": "formula",
         "needInit": true,
         "git-url": "ssh://git@gitlab.quimg.com:38001/firebug/wox-admin/data-manager/formula.git",
         "daily": {
           "ssh-host": "ssh frend@192.168.0.19",
           "git-repo": "/home/frend/build-trunk/front-wox-git/data-manager",
           "deploy-dir": "/home/frend/build-trunk/front-wox-deploy/data-manager"
         },
         "publish": {
           "ssh-host": "ssh -p 60886 frend@111.101.2.10",
           "git-repo": "/data/www/woqu/static/front-wox-git/data-manager",
           "deploy-dir": "/data/www/woqu/static/front-wox-deploy/data-manager"
         }
       }
     }
   }
  */
}

cmdsExecutor(cmds);

function cmdStrGenerator(repoName, gitUrl, taskObj) {
  if (!taskObj || typeof taskObj !== 'object' || Object.keys(taskObj).length === 0) {
    return '';
  }

  return `${taskObj['ssh-host']} 'mkdir -p ${taskObj['git-repo']} && cd ${taskObj['git-repo']} && git clone ${gitUrl} && mkdir -p ${taskObj['deploy-dir']} && cd ${taskObj['deploy-dir']} && mkdir -p ${repoName}'`;
}

const JSON = require('json5');
const getGitCmds = require('../libs/get-git-cmds');
const dataParser = require('../libs/data-parser');
const getExecuteCmds = require('../libs/get-execute-cmds');
const pushBranchDaily = require('../mock/push-branch-daily');
const pushBranchDailyWithoutSshhost = require('../mock/push-branch-daily-without-sshhost');
const pushBranchMaster = require('../mock/push-branch-master');
const pushTagPublish = require('../mock/push-tag-publish');
const deleteBranchDaily = require('../mock/delete-branch-daily');
const Fs = require('fs');
const Path = require('path');
const confPath = Path.join(__dirname, '../config');
const confFlie = Fs.readFileSync(confPath, 'utf-8');
const tasks = JSON.parse(confFlie).tasks;

describe('#getExecuteCmds', () => {
  it('should return correct push-branch-daily CMD ', () => {
    const repo = pushBranchDaily.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushBranchDaily);
    const { gitCmds, version } = getGitCmds(formatData, versionControl);
    const cmd = getExecuteCmds(task, formatData, gitCmds, version);
    cmd[0].should.eq("ssh lstx@192.168.0.4 'cd /data/dppstatic/dppstatic-git && git fetch && git checkout daily/0.0.1 && git pull origin daily/0.0.1 && mkdir -p /data/dppstatic/dppstatic-deploy && rm -rf /data/dppstatic/dppstatic-deploy/0.0.1 && mkdir /data/dppstatic/dppstatic-deploy/0.0.1 && cp -r dist /data/dppstatic/dppstatic-deploy/0.0.1'");
  });

  it('should return correct  push-branch-master CMD', () => {
    const repo = pushBranchMaster.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushBranchMaster);
    const { gitCmds, version } = getGitCmds(formatData, versionControl);
    const cmd = getExecuteCmds(task, formatData, gitCmds, version);
    cmd[0].should.eq("ssh lstx@192.168.0.19 'cd /home/lstx/build-trunk/front-wox-git/global && git fetch && git checkout master && git pull origin master && mkdir -p /home/lstx/build-trunk/front-wox-deploy/global && rm -rf /home/lstx/build-trunk/front-wox-deploy/global && mkdir /home/lstx/build-trunk/front-wox-deploy/global && cp -r dist /home/lstx/build-trunk/front-wox-deploy/global'");
  });

  it('should return correct commit push-tag-publish CMD', () => {
    const repo = pushTagPublish.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushTagPublish);
    const { gitCmds, version } = getGitCmds(formatData, versionControl);
    const cmd = getExecuteCmds(task, formatData, gitCmds, version);
    cmd[0].should.eq("ssh -p 60886 lstx@106.75.143.64 'cd /data/www/woqu/static/front-wox-git/global && git fetch && git checkout master && git pull origin master && mkdir -p /data/www/woqu/static/front-wox-deploy/global && rm -rf /data/www/woqu/static/front-wox-deploy/global && mkdir /data/www/woqu/static/front-wox-deploy/global && cp -r dist /data/www/woqu/static/front-wox-deploy/global'");
  });

  it('should return correct delete-branch-daily CMD ', () => {
    const repo = deleteBranchDaily.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(deleteBranchDaily);
    const { gitCmds, version } = getGitCmds(formatData, versionControl);
    const cmd = getExecuteCmds(task, formatData, gitCmds, version);
    cmd[0].should.eq("ssh lstx@192.168.0.4 'cd /data/dppstatic/dppstatic-git && git fetch && git checkout master && git branch -D daily/0.0.1'");
  });

  it('should return correct CMD without `ssh-host`', () => {
    const repo = pushBranchDailyWithoutSshhost.project.path_with_namespace;
    const task = {
      "daily": {
        "git-repo": "/data/dppstatic/dppstatic-git",
        "deploy-dir": "/data/dppstatic/dppstatic-deploy"
      },
      "publish": {
        "git-repo": "/data/dppstatic/dppstatic-git",
        "deploy-dir": "/data/dppstatic/dppstatic-deploy"
      }
    };
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushBranchDailyWithoutSshhost);
    const { gitCmds, version } = getGitCmds(formatData, versionControl);
    const cmd = getExecuteCmds(task, formatData, gitCmds, version);
    cmd[0].should.eq('cd /data/dppstatic/dppstatic-git && git fetch && git checkout daily/0.0.1 && git pull origin daily/0.0.1 && mkdir -p /data/dppstatic/dppstatic-deploy && rm -rf /data/dppstatic/dppstatic-deploy/0.0.1 && mkdir /data/dppstatic/dppstatic-deploy/0.0.1 && cp -r dist /data/dppstatic/dppstatic-deploy/0.0.1');
  });
});

const gitCmdsGenerator = require('../libs/git-cmds-generator');
const dataParser = require('../libs/data-parser');
const executeCmdsGenerator = require('../libs/execute-cmds-generator');
const pushBranchDaily = require('../mock/push-branch-daily');
const pushBranchDailyWithoutSshhost = require('../mock/push-branch-daily-without-sshhost');
const pushBranchMaster = require('../mock/push-branch-master');
const pushTagPublish = require('../mock/push-tag-publish');
const deleteBranchDaily = require('../mock/delete-branch-daily');
const Fs = require('fs');
const Path = require('path');
const confFlie = require('../config');
const tasks = confFlie.tasks;

describe('#executeCmdsGenerator', () => {
  /**
   * push events
   */
  it('should return correct commands for `push daily branch`', () => {
    const repo = pushBranchDaily.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushBranchDaily);
    const { gitCmds, version } = gitCmdsGenerator(formatData, versionControl);
    const cmd = executeCmdsGenerator(task, formatData, gitCmds, version);

    cmd[0].should.eq("ssh frend@192.168.0.4 'cd /data/h5static/h5static-git/icp && git fetch && git checkout daily/0.0.1 && git pull origin daily/0.0.1 && mkdir -p /data/h5static/h5static-deploy/icp && rm -rf /data/h5static/h5static-deploy/icp/0.0.1 && mkdir /data/h5static/h5static-deploy/icp/0.0.1 && cp -r dist /data/h5static/h5static-deploy/icp/0.0.1'");
  });

  it('should return correct commands for `push master branch`', () => {
    const repo = pushBranchMaster.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushBranchMaster);
    const { gitCmds, version } = gitCmdsGenerator(formatData, versionControl);
    const cmd = executeCmdsGenerator(task, formatData, gitCmds, version);

    cmd[0].should.eq("ssh frend@192.168.0.4 'cd /data/h5static/h5static-git/icp &&  && mkdir -p /data/h5static/h5static-deploy/icp && rm -rf /data/h5static/h5static-deploy/icp/ && mkdir /data/h5static/h5static-deploy/icp/ && cp -r dist /data/h5static/h5static-deploy/icp/'");
  });

  it('should return correct commands for `push publish tag`', () => {
    const repo = pushTagPublish.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushTagPublish);
    const { gitCmds, version } = gitCmdsGenerator(formatData, versionControl);
    const cmd = executeCmdsGenerator(task, formatData, gitCmds, version);

    cmd[0].should.eq("ssh -p 60886 frend@111.101.2.10 'cd /data/h5static/h5static-git/icp && git fetch && git checkout master && git pull origin master && mkdir -p /data/h5static/h5static-deploy/icp && rm -rf /data/h5static/h5static-deploy/icp/0.0.1 && mkdir /data/h5static/h5static-deploy/icp/0.0.1 && cp -r dist /data/h5static/h5static-deploy/icp/0.0.1'");
  });

  /**
   * delete events
   */
  it('should return correct commands for `delete daily branch`', () => {
    const repo = deleteBranchDaily.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(deleteBranchDaily);
    const { gitCmds, version } = gitCmdsGenerator(formatData, versionControl);
    const cmd = executeCmdsGenerator(task, formatData, gitCmds, version);

    cmd[0].should.eq("ssh frend@192.168.0.4 'cd /data/h5static/h5static-git/icp && git fetch && git checkout master && git branch -D daily/0.0.1'");
  });

  it('should return correct commands for `without ssh-host`', () => {
    const repo = pushBranchDailyWithoutSshhost.project.path_with_namespace;
    const task = {
      'daily': {
        'git-repo': '/data/dppstatic/dppstatic-git',
        'deploy-dir': '/data/dppstatic/dppstatic-deploy'
      },
      'publish': {
        'git-repo': '/data/dppstatic/dppstatic-git',
        'deploy-dir': '/data/dppstatic/dppstatic-deploy'
      }
    };
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    const formatData = dataParser(pushBranchDailyWithoutSshhost);
    const { gitCmds, version } = gitCmdsGenerator(formatData, versionControl);
    const cmd = executeCmdsGenerator(task, formatData, gitCmds, version);

    cmd[0].should.eq('cd /data/dppstatic/dppstatic-git && git fetch && git checkout daily/0.0.1 && git pull origin daily/0.0.1 && mkdir -p /data/dppstatic/dppstatic-deploy && rm -rf /data/dppstatic/dppstatic-deploy/0.0.1 && mkdir /data/dppstatic/dppstatic-deploy/0.0.1 && cp -r dist /data/dppstatic/dppstatic-deploy/0.0.1');
  });
});

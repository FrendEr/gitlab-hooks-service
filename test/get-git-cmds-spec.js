const JSON = require('json5');
const getGitCmds = require('../libs/get-git-cmds');
const dataParser = require('../libs/data-parser');
const pushBranchDaily = require('../mock/push-branch-daily');
const pushBranchMaster = require('../mock/push-branch-master');
const pushTagPublish = require('../mock/push-tag-publish');
const pushFromMaster = require('../mock/push-from-master');
const deleteFromMaster = require('../mock/delete-from-master');
const deleteBranchDaily = require('../mock/delete-branch-daily');
const Fs = require('fs');
const Path = require('path');
const confPath = Path.join(__dirname, '../config');
const confFlie = Fs.readFileSync(confPath, 'utf-8');
const tasks = JSON.parse(confFlie).tasks;

describe('#getGitCmds', () => {
  it('should return correct  push-branch-daily getGitCmds', () => {
    const data = dataParser(pushBranchDaily);
    const repo = pushBranchDaily.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    getGitCmds(data,versionControl).should.deep.eq({
      gitCmds:['git fetch','git checkout daily/0.0.1','git pull origin daily/0.0.1'],
      version:'0.0.1',
      master:false
    });
  });
  it('should return correct  push-branch-master getGitCmds', () => {
    const data = dataParser(pushBranchMaster);
    const repo = pushBranchMaster.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    getGitCmds(data,versionControl).should.deep.eq({
      gitCmds:['git fetch','git checkout master','git pull origin master'],
      version:'',
      master:true
    });
  });
  it('should return correct  push-tag-publish getGitCmds', () => {
    const data = dataParser(pushTagPublish);
    const repo = pushTagPublish.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    getGitCmds(data,versionControl).should.deep.eq({
      gitCmds:['git fetch','git checkout master','git pull origin master'],
      version:'0.0.1',
      master:false
    });
  });
  it('should return correct  push-from-master getGitCmds', () => {
    const data = dataParser(pushFromMaster);
    const repo = pushFromMaster.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    getGitCmds(data,versionControl).should.deep.eq({
      gitCmds:[],
      version:'',
      master:false
    });
  });
  it('should return correct  delete-from-master getGitCmds', () => {
    const data = dataParser(deleteFromMaster);
    const repo = deleteFromMaster.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    getGitCmds(data,versionControl).should.deep.eq({
      gitCmds:[],
      version:'',
      master:false
    });
  });
  it('should return correct  delete-branch-daily getGitCmds', () => {
    const data = dataParser( deleteBranchDaily);
    const repo = deleteBranchDaily.project.path_with_namespace;
    const task = tasks[repo];
    const taskTemp = task || { versionControl: true };
    const versionControl = taskTemp['versionControl'] != undefined ? taskTemp['versionControl'] : true;
    getGitCmds(data,versionControl).should.deep.eq({
      gitCmds:['git fetch','git checkout master','git branch -D daily/0.0.1'],
      version:'0.0.1',
      master:false
    });
  });
});
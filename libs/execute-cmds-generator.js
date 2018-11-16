const logger = require('../utils/logger');
const { warn } = logger;

module.exports = (task, formatData, gitCmds, version) => {
  const { isTag, isBranchDelete } = formatData;
  const ret = [];
  let repoConfig;
  let versionControl;

  if (!!task) {
    if (isTag) {
      repoConfig = task['publish'];
    } else{
      repoConfig = task['daily'];
    }
    versionControl = 'versionControl' in task ? task['versionControl'] : true;
  } else {
    return ret;
  }

  const gitCmdsStr = gitCmds.join(' && ');
  const repoNameStr = task['name'] ? `/${task['name']}` : '';
  const deployDir = versionControl ? `${repoConfig['deploy-dir']}${repoNameStr}/${version}` : `${repoConfig['deploy-dir']}${repoNameStr}`;
  const cdCmdStr = isBranchDelete ?
    `cd ${repoConfig['git-repo']}${repoNameStr} && ${gitCmdsStr}` :
    `cd ${repoConfig['git-repo']}${repoNameStr} && ${gitCmdsStr} && mkdir -p ${repoConfig['deploy-dir']}${repoNameStr} && rm -rf ${deployDir} && mkdir ${deployDir} && cp -r dist ${deployDir}`;
  const cmdStr = repoConfig['ssh-host'] != undefined ?
    `${repoConfig['ssh-host']} '${cdCmdStr}'` : cdCmdStr;

  warn('[DEBUG LOG] isTag:\t\t', isTag);
  warn('[DEBUG LOG] isBranchDelete:\t', isBranchDelete);
  warn('[DEBUG LOG] cmdStr:\t\t', cmdStr);

  ret.push(cmdStr);
  return ret;
}

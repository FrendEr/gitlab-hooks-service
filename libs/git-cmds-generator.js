/**
 * 命令生成器
 */

module.exports = (data, versionControl) => {
  const versionPattern = /\d*\.\d*\.\d*/;
  const tagPattern = /^publish\/\d*\.\d*\.\d*$/;
  const dailyPattern = /^daily\/\d*\.\d*\.\d*$/;
  const { isTag, tagName, branchName, isBranchDelete } = data;
  let gitCmds = [];
  let version = '';
  let master = false;

  if (isTag) {
    if (tagPattern.test(tagName)) {             // tag: 只有符合 `publish/x.y.z` 规范的 tag 才会触发正式发布
      gitCmds = gitCmds.concat([
        'git fetch',
        'git checkout master',
        'git pull origin master',
      ]);
      version = tagName.match(versionPattern)[0];
    }
  } else if (!versionControl) {                 // 无版本控制
    if (branchName == 'master') {
      gitCmds = gitCmds.concat([
        'git fetch',
        'git checkout master',
        'git pull origin master',
      ]);
      master = true;
    }
  } else if (dailyPattern.test(branchName)) {   // branch: 只有符合 `daily/x.y.z` 规范的 branch 才会触发测试发布
    if (isBranchDelete) {
      gitCmds = gitCmds.concat([
        'git fetch',
        'git checkout master',
        `git branch -D ${branchName}`
      ]);
    } else {
      gitCmds = gitCmds.concat([
        'git fetch',
        `git checkout ${branchName}`,
        `git pull origin ${branchName}`,
      ]);
    }
    version = branchName.match(versionPattern)[0];
  }

  return {
    gitCmds,
    version,
    master,
  };
}

/**
 * gitlab 接口数据解析器
 * 输出：tag 信息、分支信息、版本号信息
 */

module.exports = (data) => {
  const type = data.event_name;   // 'push' | 'tag_push'
  const ref = data.ref;           // 'refs/heads/daily/0.0.1' | 'refs/heads/master' | 'refs/tags/publish/0.0.1'
  const after = data.after;
  const userEmail = data.user_email;
  const isTag = type === 'tag_push' ? true : false;
  const tagName = isTag ? ref.replace('refs/tags/', '') : '';
  const branchName = isTag ? '' : ref.replace('refs/heads/', '');
  const isBranchDelete = /^(0)+$/.test(after);  // 删除分支也是触发 `push` 事件，需要通过 sha 值来判断是否在执行分支删除操作

  return {
    isTag,
    tagName,
    branchName,
    isBranchDelete,
    userEmail,
  };
}

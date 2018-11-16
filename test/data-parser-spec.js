const dataParser = require('../libs/data-parser');
const pushBranchDaily = require('../mock/push-branch-daily');
const pushBranchMaster = require('../mock/push-branch-master');
const pushTagPublish = require('../mock/push-tag-publish');
const pushFromMaster = require('../mock/push-from-master');
const deleteFromMaster = require('../mock/delete-from-master');
const deleteBranchDaily = require('../mock/delete-branch-daily');

describe('#dataParser', () => {
  /**
   * push events
   */
  it('should return correct data for `push master branch`', () => {
    dataParser(pushBranchMaster).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName: 'master',
      isBranchDelete: false
    });
  });
  it('should return correct data for `push dev branch`', () => {
    dataParser(pushFromMaster).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName: 'dick-from-master',
      isBranchDelete: false
    });
  });
  it('should return correct data for `push daily branch`', () => {
    dataParser(pushBranchDaily).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName: 'daily/0.0.1',
      isBranchDelete: false
    });
  });
  it('should return correct data for `push publish tag`', () => {
    dataParser(pushTagPublish).should.deep.eq({
      isTag: true,
      tagName: 'publish/0.0.1',
      branchName:'',
      isBranchDelete:false
    });
  });

  /**
   * delete events
   */
  it('should return correct data for `delete dev branch`', () => {
    dataParser(deleteFromMaster).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName: 'dick-from-master',
      isBranchDelete: true
    });
  });
  it('should return correct data for `delete daily branch`', () => {
    dataParser(deleteBranchDaily).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName: 'daily/0.0.1',
      isBranchDelete: true
    });
  });
});

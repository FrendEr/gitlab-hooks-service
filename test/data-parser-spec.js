const dataParser = require('../libs/data-parser');
const pushBranchDaily = require('../mock/push-branch-daily');
const pushBranchMaster = require('../mock/push-branch-master');
const pushTagPublish = require('../mock/push-tag-publish');
const pushFromMaster = require('../mock/push-from-master');
const deleteFromMaster = require('../mock/delete-from-master');
const deleteBranchDaily = require('../mock/delete-branch-daily');

describe('#dataParser', () => {
  it('should return correct commit push-branch-daily', () => {
    dataParser(pushBranchDaily).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName:'daily/0.0.1',
      isBranchDelete:false
    });
  });
  it('should return correct commit push-branch-master', () => {
    dataParser(pushBranchMaster).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName:'master',
      isBranchDelete:false
    });
  });
  it('should return correct commit push-tag-publish', () => {
    dataParser(pushTagPublish).should.deep.eq({
      isTag: true,
      tagName: 'publish/0.0.1',
      branchName:'',
      isBranchDelete:false
    });
  });
  it('should return correct commit push-from-master', () => {
    dataParser(pushFromMaster).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName:'dick-from-master',
      isBranchDelete:false
    });
  });
  it('should return correct commit delete-from-master', () => {
    dataParser(deleteFromMaster).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName:'dick-from-master',
      isBranchDelete:true
    });
  });
  it('should return correct commit delete-branch-daily', () => {
    dataParser(deleteBranchDaily).should.deep.eq({
      isTag: false,
      tagName: '',
      branchName:'daily/0.0.1',
      isBranchDelete:true
    });
  });
});

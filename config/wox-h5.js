module.exports = {
  'firebug/h5-lulutrip': {
    'name': 'h5-lulutrip',
    'git-url': 'ssh://git@gitlab.quimg.com/firebug/h5-lulutrip.git',
    'daily': {
      'ssh-host': 'ssh frend@192.168.0.4',
      'git-repo': '/data/h5static/h5static-git',
      'deploy-dir': '/data/h5static/h5static-deploy'
    },
    'publish': {
      'ssh-host': 'ssh -p 60886 frend@111.101.2.10',
      'git-repo': '/data/h5static/h5static-git',
      'deploy-dir': '/data/h5static/h5static-deploy'
    }
  },
  'firebug/h5-activity': {
    'name': 'h5-activity',
    'git-url': 'ssh://git@gitlab.quimg.com/firebug/h5-activity.git',
    'daily': {
      'ssh-host': 'ssh frend@192.168.0.4',
      'git-repo': '/data/h5static/h5static-git',
      'deploy-dir': '/data/h5static/h5static-deploy'
    },
    'publish': {
      'ssh-host': 'ssh -p 60886 frend@111.101.2.10',
      'git-repo': '/data/h5static/h5static-git',
      'deploy-dir': '/data/h5static/h5static-deploy'
    }
  },
};

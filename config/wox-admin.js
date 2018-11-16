module.exports = {
  'firebug/wox-admin/compare-tool': {
    'versionControl': false,
    'name': 'compare-tool',
    'git-url': 'ssh://git@gitlab.quimg.com/firebug/wox-admin/compare-tool.git',
    'daily': {
      'ssh-host': 'ssh frend@192.168.0.234',
      'git-repo': '/home/frend/build-trunk/front-wox-git',
      'deploy-dir': '/home/frend/build-trunk/front-wox-deploy'
    },
    'publish': {
      'ssh-host': 'ssh -p 60886 frend@111.101.2.10',
      'git-repo': '/data/www/woqu/static/front-wox-git',
      'deploy-dir': '/data/www/woqu/static/front-wox-deploy'
    }
  },
  'firebug/wox-admin/data-manager/formula': {
    'versionControl': false,
    'name': 'formula',
    'git-url': 'ssh://git@gitlab.quimg.com/firebug/wox-admin/data-manager/formula.git',
    'daily': {
      'ssh-host': 'ssh frend@192.168.0.234',
      'git-repo': '/home/frend/build-trunk/front-wox-git/data-manager',
      'deploy-dir': '/home/frend/build-trunk/front-wox-deploy/data-manager'
    },
    'publish': {
      'ssh-host': 'ssh -p 60886 frend@111.101.2.10',
      'git-repo': '/data/www/woqu/static/front-wox-git/data-manager',
      'deploy-dir': '/data/www/woqu/static/front-wox-deploy/data-manager'
    }
  },
};

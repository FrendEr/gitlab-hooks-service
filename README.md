# Gitlab Hooks Service

gitlab 前端自动部署服务

## 项目接入须知

#### 项目目录规范

> 测试与生产环境最终只会部署 `dist` 目录，所以请务必保证项目存在 `dist` 目录，并且所有外部引用的资源都只存在于 `dist` 目录下。如果不符合规范，会导致自动部署流程失败

```
.
├── dist          // 构建后的代码
├── src           // 项目源代码
└── ...
```

## 部署流程

#### 1、设置项目 **Webhooks**

项目 -> *Settings* -> *Integrations* -> 添加 *URL* —— `http://gitlabhook.quimg.com`，并勾选 `☑️ Push events` 以及 `☑️ Tag push events`

#### 2、在 **[config 目录](./config)** 增加项目配置

```
// config/wox-admin.js

{
  "tasks": {
    "firebug/wox-admin/compare-tool": {                            // 项目路径：group_name/repository_name
      "versionControl": false,                                     // 是否使用版本控制，默认为 true
      "needInit": true,                                            // 是否需要初始化仓库与目录（新增的部署项目才需要）
      "name": "compare-tool",                                      // 项目名称      
      "daily": {                                                   // 测试环境配置
        "ssh-host": "ssh frend@192.168.0.19",                      // 登录测试环境
        "git-repo": "/home/frend/build-trunk/front-wox-git",       // 测试环境项目仓库地址
        "deploy-dir": "/home/frend/build-trunk/front-wox-deploy"   // 测试环境项目部署地址
      },
      "publish": {                                                 // 生产环境配置
        "ssh-host": "ssh -p 60886 frend@111.101.2.10",             // 登录生产环境
        "git-repo": "/data/www/woqu/static/front-wox-git",         // 生产环境项目仓库地址
        "deploy-dir": "/data/www/woqu/static/front-wox-deploy"     // 生产环境项目部署地址
      }
    },
    ...
  }
}
```

#### 3、无版本控制发布流程 —— `"versionControl": false`

* **发布到测试环境**

  1. 从 **master** 拉取开发分支 **dev_from_master**
  ```
  $ git checkout -b dev_from_master
  ```

  1. 开发完后提 `merge request` 到 **master** 分支

  1. 点击 `Merge` 将开发分支 **dev_from_master** 合并到 **master**，系统将自动触发测试环境的代码部署

* **发布到生产环境**

  1. 切换到 **master** 分支并拉取最新的代码
  ```
  $ git pull origin master
  ```

  1. 创建 **tag** 并提交
  ```
  $ git tag publish/x.y.z             // tag 必须符合 `publish/x.y.z` 的命名规则
  $ git push origin publish/x.y.z
  ```

#### 4、带版本控制发布流程

* **发布到测试环境**

  1. 从 **master** 分支拉取测试分支 **daily/x.y.z**
  ```
  $ git checkout -b daily/x.y.z       // 测试分支必须符合 `daily/x.y.z` 的命名规则
  ```

  1. 从测试分支 **daily/x.y.z** 拉取开发分支 **dev_from_daily/x.y.z**
  ```
  $ git checkout -b dev_from_daily/x.y.z
  ```

  1. 开发完后提 `merge request` 到 **daily/x.y.z** 分支

  1. 点击 `Merge` 将开发分支合并到 **daily/x.y.z**，系统将自动触发测试环境的代码部署

* **发布到生产环境**

  1. 切换到 **daily/x.y.z** 分支并拉取最新的代码
  ```
  $ git pull origin daily/x.y.z
  ```

  1. 从测试分支 **daily/x.y.z** 提 `merge request` 到 **master** 分支

  1. 点击 `Merge` 将测试分支 **daily/x.y.z** 合并到 **master**

  1. 切换到 **master** 分支并拉取最新的代码
  ```
  $ git pull origin master
  ```

  1. 创建 **tag** 并提交
  ```
  $ git tag publish/x.y.z             // tag 必须符合 `publish/x.y.z` 的命名规则
  $ git push origin publish/x.y.z
  ```

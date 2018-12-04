/**
 * 脚本执行器
 */
const Os = require('os');
const Fs = require('fs');
const Path = require('path');
const Tmp = require('temp');
const execFile = require('child_process').execFile;
const logger = require('../utils/logger');
const { info, error } = logger;
const nodemailer = require('nodemailer');
const emailConfig = require('../email.json');
let idx = 0;

Tmp.track();

module.exports = (cmds, repo, task, formatData, version) => {
  if (cmds.length > 0) {
    Tmp.mkdir({dir: Os.tmpdir(), prefix: 'gitlabhook.'}, function(err, path) {
      if (err) {
        error(err);
        return;
      }
      info(`Tempdir: ${path}`);
      execute(cmds, path, repo, task, formatData, version);
    });
  }
}

const { user: EMAIL_FROM, pass: PASSWORD } = emailConfig;
const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: PASSWORD,
  }
});

function execute(cmds, path, repo, task, formatData, version) {
  const { isTag, tagName, branchName, isBranchDelete, userEmail } = formatData;

  if (idx == cmds.length) {
    info(`Remove working directory: ${path}`);
    idx = 0;
    Tmp.cleanup();

    // success email notification start
    if (!isBranchDelete) {
      nodemailer.createTestAccount((err, account) => {
        const mailOptions = {
          from: EMAIL_FROM,
          to: userEmail,
          subject: 'Gitlab 前端发布通知',
          text: '🎉 发布成功！',
          html: `<div style="font-family: andalemono, menlo, monospace, microsoft yahei;">
            <h2 style="color: green;">🎉 发布成功！</h2>
            <br />
            <p><strong>📝 项目名称：</strong><a href="http://gitlab.quimg.com:38000/${repo}" target="_blank">${repo}</a></p>
            <p><strong>🖥 发布环境：</strong>${isTag ? '生产' : '测试'}</p>
            <p><strong>🛠 发布${isTag ? 'Tag' : '分支'}：</strong>${version ? isTag ? 'publish/' + version : 'daily/' + version : '无版本控制'}</p>
            <br />
            <p style="font-size: 13px;color: #666;">🚨 该发布消息仅检测服务端脚本执行过程，静态资源服务更新仍有失败几率，若更新有问题请联系 @Frend</p>
          </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
      });
    }
    // success email notification end

    return;
  }

  const fname = Path.join(path, 'task-' + pad(idx, 3));
  Fs.writeFile(fname, cmds[idx], function(err) {
    if (err) {
      error(`File creation error: ${err}`);
      return;
    }
    info(`File created: ${fname}`);
    execFile('/bin/sh', [ fname ], { cwd: path, env: process.env }, function(err, stdout, stderr) {
      if (err) {
        error(`Exec error: ${err}`);

        // fail email notification start
        nodemailer.createTestAccount((err, account) => {
          const mailOptions = {
            from: EMAIL_FROM,
            to: userEmail,
            subject: 'Gitlab 前端发布通知',
            text: '🙈 发布失败！',
            html: `<div style="font-family: andalemono, menlo, monospace, microsoft yahei;">
              <h2 style="color: red;">🙈 发布失败！</h2>
              <br />
              <p style="font-size: 13px;color: #666;">🚨 服务器更新脚本执行出错，请联系 @Frend</p>
            </div>`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
          });
        });
        // fail email notification end
      } else {
        info(`Executed: /bin/sh ${fname}`);
        process.stdout.write(stdout);
      }
      process.stderr.write(stderr);
      idx++;
      execute(cmds, path, repo, task, formatData, version);
    });
  });
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const gitlabhook = require('./libs/gitlabhook');

const gitlab = gitlabhook({
	port: 3420,
});

gitlab.listen();

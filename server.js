//const app = require('express')();
const koa = require('koa');
const router = require('koa-router')();
const cors = require('koa2-cors');
const app = new koa();
const server = require('http').Server(app.callback());
const next = require('next');
const bodyParser = require('koa-bodyparser');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();


// CORS 관련 옵션 설정
app.use(
	cors({
		origin: (ctx) => '*'
	})
);

app.use(bodyParser());

nextApp.prepare().then(() => {


  router.get('*', async (ctx, next) => {
    return await nextHandler(ctx.req, ctx.res);
  })

  app.use(router.routes());

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on port: ${port}`)
  })
})

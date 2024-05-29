const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/words', '/languages'],
    createProxyMiddleware({
      target: 'http://node-app:3001',
      changeOrigin: true,
    })
  );
};
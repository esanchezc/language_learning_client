const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = process.env.REACT_APP_NODE_APP_URL || 'http://localhost:3001';
  app.use(
    ['/words', '/languages'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
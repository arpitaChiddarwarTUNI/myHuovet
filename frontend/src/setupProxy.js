const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/medicine/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/supply/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/item/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/stock/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/vatgroup/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/invoicegroup/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/itemlist/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/stocklevel/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/department/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
    app.use('/wholesaler/', createProxyMiddleware({ target: 'https://awstest.provetcloud.com/7357/api/0.1', changeOrigin: true }));
};


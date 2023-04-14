/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

// config for next-images
const withImages = require("next-images");
module.exports = withImages();

// config for api redirection
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: '/api/auth/:path*',
      },
    ];
  },
  async devServer(options) {
    const proxy = createProxyMiddleware('/api/auth', {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/auth': '/api/auth',
      },
    });

    options.app.use(proxy);
    return options;
  },
};



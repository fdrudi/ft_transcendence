/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

// config for next-images
const withImages = require("next-images");
module.exports = withImages();

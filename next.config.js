/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  typescript: {
      ignoreBuildErrors: true,
  },
  output: "standalone",
};

module.exports = nextConfig;

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      removeUselessDefs: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset',
      resourceQuery: /url/,
    });

    return config;
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

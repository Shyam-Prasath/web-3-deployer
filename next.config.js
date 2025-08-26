const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig = withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // 🔥 Fix for "ms does not contain a default export"
    config.module.rules.push({
      test: /weald[\\/]dist[\\/]src[\\/]browser\.js$/,
      use: [
        {
          loader: "string-replace-loader",
          options: {
            search: `import humanize from 'ms';`,
            replace: `import * as humanize from 'ms';`,
          },
        },
      ],
    });

    return config;
  },
});

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Allow cross-origin requests in development
  allowedDevOrigins: ['192.168.191.230'],
  // Updated configuration for Next.js 15
  turbopack: {
    // Turbopack is now stable, configure as needed
  },
  // Simplified webpack config to prevent memory issues
  webpack: (config, { dev }) => {
    // In development mode, disable cache to prevent memory issues
    if (dev) {
      config.cache = false;
    }
    
    // Add support for .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
    });
    
    // Increase performance budget to avoid memory constraints
    if (config.performance) {
      config.performance.hints = false;
    }
    
    return config;
  },
};

module.exports = nextConfig;
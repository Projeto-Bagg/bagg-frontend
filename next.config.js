/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['default', 'en', 'pt'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  reactStrictMode: true,
  output: 'standalone',
};

module.exports = nextConfig;

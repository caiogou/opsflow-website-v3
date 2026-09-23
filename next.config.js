/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Engines and the S&OP diagnostic live at the root (English). Localised paths redirect there.
    return ['en', 'de', 'fr'].flatMap((l) => [
      { source: `/${l}/platform`, destination: '/platform', permanent: true },
      { source: `/${l}/platform/:path*`, destination: '/platform/:path*', permanent: true },
      { source: `/${l}/diagnostic`, destination: '/diagnostic', permanent: true },
    ])
  },
}
module.exports = nextConfig

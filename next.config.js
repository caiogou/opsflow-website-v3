/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // 05/oct/2026: Academy and the diagnostic Platform were removed (Caio alignment). Old URLs keep working:
    // Academy -> home (EN), Platform -> the free S&OP Health Check. The diagnostic lives at the root (English).
    return [
      { source: '/academy', destination: '/en', permanent: true },
      { source: '/academy/:path*', destination: '/en', permanent: true },
      { source: '/platform', destination: '/diagnostic', permanent: true },
      { source: '/platform/:path*', destination: '/diagnostic', permanent: true },
      ...['en', 'de', 'fr'].flatMap((l) => [
        { source: `/${l}/platform`, destination: '/diagnostic', permanent: true },
        { source: `/${l}/platform/:path*`, destination: '/diagnostic', permanent: true },
        { source: `/${l}/academy`, destination: '/en', permanent: true },
        { source: `/${l}/diagnostic`, destination: '/diagnostic', permanent: true },
      ]),
    ]
  },
}
module.exports = nextConfig

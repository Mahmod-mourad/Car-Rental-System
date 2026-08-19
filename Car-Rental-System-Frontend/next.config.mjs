/** @type {import('next').NextConfig} */
const nextConfig = {
  // These were both true, which meant `next build` reported success while the
  // project had over a hundred type errors. A build that cannot fail is not a check.
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

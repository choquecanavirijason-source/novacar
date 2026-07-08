/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Clean Architecture: las capas internas no dependen de Next; sólo /presentation usa "use client".
  typedRoutes: true,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Clean Architecture: las capas internas no dependen de Next; sólo /presentation usa "use client".
  typedRoutes: true,
  images: {
    // Placeholder externo usado como respaldo mientras faltan assets propios
    // (ver vehiclePresentation.ts / partPresentation.ts).
    remotePatterns: [{ protocol: "https", hostname: "loremflickr.com" }],
  },
};

export default nextConfig;

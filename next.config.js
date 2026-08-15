/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "millenniumsignage.co.za" },
      { protocol: "https", hostname: "static-01.daraz.com.bd" },
      { protocol: "https", hostname: "www.graphicana.in" },
      { protocol: "https", hostname: "s.alicdn.com" },
    ],
  },
};

module.exports = nextConfig;

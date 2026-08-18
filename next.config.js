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
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "millenniumsignage.co.za" },
      { protocol: "https", hostname: "static-01.daraz.com.bd" },
      { protocol: "https", hostname: "www.graphicana.in" },
      { protocol: "https", hostname: "s.alicdn.com" },
      { protocol: "https", hostname: "nneeoonn.com" },
      { protocol: "https", hostname: "www.fasciasigns.com" },
      { protocol: "https", hostname: "inoxgiahung.vn" },
      { protocol: "https", hostname: "flagbanner.us" },
      { protocol: "https", hostname: "www.signs4au.com" },
      { protocol: "https", hostname: "image.made-in-china.com" },
      { protocol: "https", hostname: "sourceprinting.co.za" },
      { protocol: "https", hostname: "lamaisonduneon.com" },
      { protocol: "https", hostname: "i.etsystatic.com" },
      { protocol: "https", hostname: "www.haichenled.com" },
      { protocol: "https", hostname: "a.storyblok.com" },
    ],
  },
};

module.exports = nextConfig;

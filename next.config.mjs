/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        domain: "res.cloudinary.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;

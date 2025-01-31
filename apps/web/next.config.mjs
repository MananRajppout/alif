/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "images.pexels.com",
      "placeimg.com",
      "placehold.co",
      "via.placeholder.com",
      "lh3.googleusercontent.com",
      "ui-avatars.com"
      // 'via.placeholder.com',
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

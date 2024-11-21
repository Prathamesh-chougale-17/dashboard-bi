/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
      remotePatterns:[
        {
          protocol: 'https',
          hostname:  "api.microlink.io"
        }
      ]
    },
};

export default nextConfig;

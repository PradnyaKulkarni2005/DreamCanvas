import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ytimg.com'], // 👈 Whitelist YouTube thumbnail domain
  }
};
// next.config.js
//exposed environment variables to the client side
// This is necessary for the OpenAI API key to be accessible in the client-side code
// without this, the API key won't be available in the browser
module.exports = {
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
};



export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the native better-sqlite3 driver and Prisma out of the bundle so the
  // adapter loads correctly at runtime on the Node.js server.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-better-sqlite3",
    "better-sqlite3",
  ],
};

export default nextConfig;

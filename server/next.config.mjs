import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the output file tracing root to the server directory
  outputFileTracingRoot: __dirname,
};

export default nextConfig;

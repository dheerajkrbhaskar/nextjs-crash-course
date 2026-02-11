import type { NextConfig } from "next";

const posthogHost = "https://us.i.posthog.com";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/ingest/decide",
          destination: `${posthogHost}/decide?v=3`,
        },
        {
          source: "/ingest/engage",
          destination: `${posthogHost}/engage/?compression=gzip`,
        },
        {
          source: "/ingest/decide/:path*",
          destination: `${posthogHost}/decide/:path*`,
        },
        {
          source: "/ingest/:path*",
          destination: `${posthogHost}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;

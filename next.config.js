/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    return config;
  },

  env: {
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    //   "pk_test_c3dlZXQtc2hlZXAtNTcuY2xlcmsuYWNjb3VudHMuZGV2JA",
    // CLERK_SECRET_KEY: "sk_test_dgoiYgRLK81pPLZoPa5p3PXeFni1AXv78IGfLnn6H7",
    // NEXT_PUBLIC_CLERK_SIGN_IN_URL: "/sign-in",
    // NEXT_PUBLIC_CLERK_SIGN_UP_URL: "/sign-in",
    // NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: "/",
    // NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: "/",

    // DATABASE_URL: `postgresql://postgres:125690@localhost:5432/postgres`,

    ABLY_API_KEY: "n-gD0A.W4KQCg:GyPm6YTLBQsr4KhgPj1dLCwr0eg4y7OVFrBuyztiiWg",

    // NEXT_PUBLIC_APP_URL: "http://localhost:3000",

    // NEXT_PUBLIC_TEACHER_ID_1: "user_2aTRLzhHnrafjaBucQbFrfMteOV",
    // NEXT_PUBLIC_TEACHER_ID_2: "user_2aQkDsNvSmA1tFkDV9OXpuEGbBi",

    // ACCOUNT_URL:
    //   "https://hcm03.vstorage.vngcloud.vn/v1/AUTH_507a0f58b97a426ab429e5a0ce063b7f",
    // TEMP_URL_KEY:
    //   "YTQ2YzcyOWMtNWFiZC00ZjIwLTljMGYtYzBiYTkxYjVjODZjLVRyYWluaW5nU3RvcmFnZV9scGNfc2VydmljZXNAbHAuY29tLnZu",
    // USERNAME: "1b1b550",
    // PASSWORD: "KmHnm!r5",
    // ID: "507a0f58b97a426ab429e5a0ce063b7f",
  },
};

module.exports = nextConfig;

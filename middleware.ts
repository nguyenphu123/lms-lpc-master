import {
  authMiddleware,
  redirectToSignIn,
  redirectToSignUp,
} from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/api/webhook",
    "/api/checkLDAP",
    "/api/authLDAP",
    "/api/notifications",
    "/api/signup",
    "/api/departments",
    "/api/department",
    // "https://rest.ably.io/**",
  ],
  // debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

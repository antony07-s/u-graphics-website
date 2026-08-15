import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

// Protect everything under /admin EXCEPT the login page itself
// (otherwise you'd get redirected in an infinite loop trying to reach login).
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
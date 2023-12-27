import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

const getHostName = (req: NextRequest) => {
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3123)
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  let hostname = req.headers.get("host")!.replace(".localhost:3123", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // special case for Vercel preview deployment URLs
  if (hostname.includes("---") && hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)) {
    hostname = `${hostname.split("---")[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  return hostname;
};

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: (req) => {
    const hostname = getHostName(req);
    return hostname !== `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  },
  afterAuth: (auth, req) => {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3123)
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const hostname = getHostName(req);

    const searchParams = req.nextUrl.searchParams.toString();
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // rewrites for app pages
    if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
      if (!auth.userId && !auth.isPublicRoute && !path.startsWith("/auth")) {
        const prefix = process.env.NODE_ENV === "development" ? "http://" : "https://";
        return redirectToSignIn({ returnBackUrl: `${prefix}${hostname}/` });
      }

      return NextResponse.rewrite(new URL(`/app${path === "/" ? "" : path}`, req.url));
    }

    if (!path.startsWith("/app")) {
      return NextResponse.rewrite(new URL(path, req.url));
    }
    return NextResponse.rewrite(new URL("/404", req.url));
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

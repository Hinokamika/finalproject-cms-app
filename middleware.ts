import { NextResponse, type NextRequest } from "next/server";

// Protect all pages and API except assets and auth/login
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico";

  const isAuthRoute = pathname.startsWith("/api/auth/") || pathname === "/login";
  if (isAsset || isAuthRoute) return NextResponse.next();

  // Protect everything else (pages + API)
  const access = req.cookies.get("sb-access-token")?.value;
  if (!access) {
    // Redirect to login for pages; allow API routes to 401
    if (!pathname.startsWith("/api/")) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};

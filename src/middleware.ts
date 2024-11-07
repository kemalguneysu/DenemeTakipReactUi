import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

  const token =
    request.cookies.get("accessToken")?.value 

  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);

      const roleClaimName =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const roles = decoded[roleClaimName]
        ? Array.isArray(decoded[roleClaimName])
          ? decoded[roleClaimName]
          : [decoded[roleClaimName]]
        : [];

      isAuthenticated = true;
      isAdmin = roles.includes("admin");
    } catch (error) {
    }
  }


  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/giris-yap", request.url));
  }

  if (!isAdmin && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/giris-yap", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/denemelerim/:path*",
    "/analizlerim/:path*",
    "/admin/:path*",
    "/hesabim/:path",
    "/konu-takip/:path*",
  ],
};

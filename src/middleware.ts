// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  console.log("Middleware - Path:", path);
  console.log("Middleware - Token exists:", !!token);

  // Allow access to sign-in page and API auth routes
  if (path === "/sign-in" || path.startsWith("/api/auth")) {
    if (token && path === "/sign-in") {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
        const { payload } = await jwtVerify(token, secret);
        const role = payload.role as string;
        console.log("User already logged in, redirecting to:", `/${role.toLowerCase()}`);
        return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, request.url));
      } catch (error) {
        console.error("Invalid token on sign-in page:", error);
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Check if token exists for protected routes
  if (!token) {
    console.log("No token found, redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;
    console.log("Decoded token - Role:", role);

    // Extract the role from the URL path
    const pathSegments = path.split("/");
    const firstSegment = pathSegments[1]?.toUpperCase();
    
    // Check if the user is trying to access a role-specific route
    if (["ADMIN", "TEACHER", "STUDENT", "PARENT"].includes(firstSegment)) {
      console.log("Requested role:", firstSegment, "User role:", role);
      
      // If user doesn't have permission for this role
      if (role !== firstSegment) {
        console.log("Role mismatch, redirecting to:", `/${role.toLowerCase()}`);
        return NextResponse.redirect(
          new URL(`/${role.toLowerCase()}`, request.url)
        );
      }
    }

    console.log("Access granted to:", path);
    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth/login).*)",
  ],
};
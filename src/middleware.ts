import {
  NextRequest,
  NextResponse
} from "next/server";

import jwt from "jsonwebtoken";

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      "token"
    )?.value;

  const path =
    request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/sign-in",
        request.url
      )
    );
  }

  try {
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as any;

    const role =
      decoded.role;

    if (
      path.startsWith(
        "/admin"
      ) &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL(
          "/sign-in",
          request.url
        )
      );
    }

    if (
      path.startsWith(
        "/teacher"
      ) &&
      role !==
        "TEACHER"
    ) {
      return NextResponse.redirect(
        new URL(
          "/sign-in",
          request.url
        )
      );
    }

    if (
      path.startsWith(
        "/student"
      ) &&
      role !==
        "STUDENT"
    ) {
      return NextResponse.redirect(
        new URL(
          "/sign-in",
          request.url
        )
      );
    }

    if (
      path.startsWith(
        "/parent"
      ) &&
      role !== "PARENT"
    ) {
      return NextResponse.redirect(
        new URL(
          "/sign-in",
          request.url
        )
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL(
        "/sign-in",
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/parent/:path*",
  ],
};
// lib/authorize.ts (Simplified version)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function authorize(req: Request, roles: string[]) {
  try {
    // Get token from cookie
    const cookieHeader = req.headers.get("cookie");
    let token = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      token = cookies.token;
    }

    if (!token) {
      throw new Error("No token provided");
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
    const { payload } = await jwtVerify(token, secret);
    
    const userRole = payload.role as string;
    
    if (!roles.includes(userRole)) {
      throw new Error(`Role ${userRole} not authorized`);
    }

    return {
      id: payload.id as string,
      username: payload.username as string,
      email: payload.email as string,
      role: userRole,
    };
  } catch (error) {
    console.error("Authorization error:", error);
    throw new Error("Unauthorized");
  }
}
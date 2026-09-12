import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET!;

export function generateToken(
  payload: any
) {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyToken(
  token: string
) {
  return jwt.verify(
    token,
    JWT_SECRET
  );
}


export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET!
    );

    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as string,
      username: payload.username as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}
import jwt from "jsonwebtoken";

export function authorize(
  req: Request,
  allowedRoles: string[]
) {
  const auth =
    req.headers.get(
      "authorization"
    );

  if (!auth)
    throw new Error(
      "Unauthorized"
    );

  const token =
    auth.replace(
      "Bearer ",
      ""
    );

  const decoded =
    jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

  if (
    !allowedRoles.includes(
      decoded.role
    )
  ) {
    throw new Error(
      "Forbidden"
    );
  }

  return decoded;
}
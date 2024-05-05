import type { JwtPayload } from "jsonwebtoken";
import { sign, verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";

function verifyToken(req: NextRequest, isJwt: boolean): any {
  try {
    const token = req.headers.get("authorization");
    if (!token) return;
    if (!process.env.ACCESS_TOKEN_SECRET) return;
    const decoded = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    ) as JwtPayload;

    return decoded.id;
  } catch (error) {
    if (isJwt) {
      throw error;
    }
  }
}

function createAccessToken(payload: object) {
  if (!process.env.ACCESS_TOKEN_SECRET) return;
  return sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
}

export const auth = {
  verifyToken,
  createAccessToken,
};

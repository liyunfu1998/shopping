import type { NextRequest } from "next/server";
import { auth } from "../auth";

export async function jwtMiddleware(req: NextRequest, isJwt = false) {
  const id: string = auth.verifyToken(req, isJwt);
  req.headers.set("userId", id);
}

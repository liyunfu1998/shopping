import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Schema } from "zod";
import type { Role } from "../constants";
import { errorHandler } from "./error-handler";
import { identityMiddleware } from "./identity-middleware";
import { jwtMiddleware } from "./jwt-middleware";
import { validateMiddleware } from "./validate-middleware";

function isPublicPath(req: NextRequest) {
  const publicPaths = [
    "POST:/api/auth/login",
    "POST:/api/auth/logout",
    "POST:/api/auth/register",
  ];
  return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}

export function apiHandler(
  handler: (req: NextRequest, ...args: any) => any,
  {
    identity,
    schema,
    isJwt,
  }: { identity?: Role; schema?: Schema; isJwt?: boolean },
) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      if (!isPublicPath(req)) {
        await jwtMiddleware(req, isJwt);
        await identityMiddleware(req, identity, isJwt);
        await validateMiddleware(req, schema);
      }
      const responseBody = await handler(req, args);
      return NextResponse.json(responseBody ?? {});
    } catch (err: any) {
      console.log("global error handler", err);
      return errorHandler(err);
    }
  };
}

import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { Role } from "~/lib/constants";
import { db } from "~/server/db";
export async function identityMiddleware(
  req: NextRequest,
  identity?: Role,
  isJwt = false,
) {
  if (identity === Role.USER && isJwt === false) return;

  const userId = req.headers.get("userId");
  if (!userId) return;
  const user: User | null = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.role && user?.root !== undefined) {
    req.headers.set("userRole", JSON.stringify(user?.role));
    req.headers.set("userRoot", JSON.stringify(user?.root));
  }

  if (identity === Role.ADMIN && (user?.role as Role) !== Role.ADMIN) {
    throw new Error("无权操作");
  }

  if (identity === Role.ROOT && !user?.root) {
    throw new Error("无权操作，仅超级管理可操作");
  }
}

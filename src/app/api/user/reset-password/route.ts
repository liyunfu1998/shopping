import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiHandler, setJson } from "~/lib/middleware";
import { userRepo } from "~/server/user";

const resetPassword = apiHandler(
  async (req: NextRequest) => {
    const userId = req.headers.get("userId");
    const { password }: { password: string } = await req.json();

    if (!userId || !password) {
      throw "请填写完整";
    }
    await userRepo.resetPassword(userId, password);

    return setJson({
      message: "密码更新成功",
    });
  },
  {
    isJwt: true,
    schema: z.object({
      password: z.string().min(6),
    }),
  },
);

export const PATCH = resetPassword;
export const dynamic = "force-dynamic";

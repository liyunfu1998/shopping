import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiHandler, setJson } from "~/lib/middleware";
import { userRepo } from "~/server/user";

const login = apiHandler(
  async (req: NextRequest) => {
    const body: User = await req.json();
    const result = await userRepo.authenticate(body);
    return setJson({
      data: result,
      message: "登录成功",
    });
  },
  {
    schema: z.object({
      email: z.string(),
      password: z.string().min(6),
    }),
  },
);

export const POST = login;
export const dynamic = "force-dynamic";

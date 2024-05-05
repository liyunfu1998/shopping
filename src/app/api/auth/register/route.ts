import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { apiHandler, setJson } from "~/lib/middleware";
import { userRepo } from "~/server/user";

import z from "zod";
const register = apiHandler(
  async (req: NextRequest) => {
    const body: User = await req.json();
    const result = await userRepo.create(body);
    return setJson({
      data: result,
    });
  },
  {
    schema: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string().min(6),
    }),
  },
);

export const POST = register;
export const dynamic = "force-dynamic";

import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import z from "zod";
import { Role } from "~/lib/constants";
import { apiHandler, setJson } from "~/lib/middleware";
import { userRepo } from "~/server/user";

const getUsers = apiHandler(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    if (!searchParams) return;
    const page = searchParams?.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const page_size = searchParams.get("page_size")
      ? Number(searchParams.get("page_size"))
      : 5;

    const result = await userRepo.getAll({
      page,
      page_size,
    });

    return setJson({
      data: result,
    });
  },
  {
    isJwt: true,
    identity: Role.ADMIN,
  },
);

const updateInfo = apiHandler(
  async (req: NextRequest) => {
    const userId = req.headers.get("userId");
    const body: User = await req.json();
    const result = await userRepo.update(userId, body);

    return setJson({
      data: result,
    });
  },
  {
    isJwt: true,
    schema: z.object({
      name: z.string(),
      address: z.any(),
      mobile: z.string(),
    }),
  },
);

export const GET = getUsers;
export const PATCH = updateInfo;

export const dynamic = "force-dynamic";

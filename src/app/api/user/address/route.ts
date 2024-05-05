import type { Address } from "@prisma/client";
import type { NextRequest } from "next/server";
import z from "zod";
import { apiHandler, setJson } from "~/lib/middleware";
import { addressRepo } from "~/server/address";
import { userRepo } from "~/server/user";

const addAddress = apiHandler(
  async (req: NextRequest) => {
    const userId = req.headers.get("userId");
    const body: Address = await req.json();
    if (!userId) throw "用户不存在";
    const result = await userRepo.updateUserAddress(userId, body);

    return setJson({
      data: result,
    });
  },
  {
    isJwt: true,
    schema: z.object({
      postalCode: z.string().min(6).max(6),
      street: z.string(),
      areaCode: z.string(),
      cityCode: z.string(),
      provinceCode: z.string(),
    }),
  },
);

const getAddress = apiHandler(
  async (req: NextRequest) => {
    const userId = req.headers.get("userId");
    if (!userId) throw "用户不存在";
    const result = await addressRepo.getListByUserId(userId);

    return setJson({
      data: result,
    });
  },
  {
    isJwt: true,
  },
);

export const POST = addAddress;
export const GET = getAddress;
export const dynamic = "force-dynamic";

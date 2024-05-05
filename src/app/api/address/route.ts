// import { initialize } from "~/server/address";
import type { NextRequest } from "next/server";
import { apiHandler, setJson } from "~/lib/middleware";
import { addressRepo } from "~/server/address";

const getAddresses = apiHandler(
  // initialize(); 用于初始化省市区数据库
  async (req: NextRequest) => {
    const result = await addressRepo.getAll();

    return setJson({
      data: result,
    });
  },
  {
    isJwt: true,
  },
);

export const GET = getAddresses;
export const dynamic = "force-dynamic";

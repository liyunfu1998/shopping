import type { NextRequest } from "next/server";
import { apiHandler, setJson } from "~/lib/middleware";
import { userRepo } from "~/server/user";

const getUserInfo = apiHandler(
  async (req: NextRequest) => {
    const userId = req.headers.get("userId");
    if (!userId) throw "未登录";
    const user = await userRepo.getById(userId);
    return setJson({
      data: {
        name: user?.name,
        email: user?.email,
        role: user?.role,
        root: user?.root,
        addresses: user?.addresses,
        mobile: user?.mobile,
      },
    });
  },
  {
    isJwt: true,
  },
);

export const GET = getUserInfo;
export const dynamic = "force-dynamic";

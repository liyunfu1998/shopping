import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { Role } from "~/lib/constants";
import { apiHandler, setJson } from "~/lib/middleware";
import { userRepo } from "~/server/user";

const updateRole = apiHandler(
  async (req: NextRequest, { params }: { params: Partial<User> }) => {
    const { id } = params;
    if (!params?.role) throw "role不存在";

    await userRepo.update(id, {
      role: params.role ?? Role.USER,
    });
    return setJson({
      message: "更新成功",
    });
  },
  {
    isJwt: true,
    schema: z.object({
      role: z.enum([Role.ADMIN, Role.ROOT, Role.USER]),
    }),
    identity: Role.ROOT,
  },
);

const deleteUser = apiHandler(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Partial<User>;
    },
  ) => {
    const { id } = params;
    if (!id) {
      throw "id不存在";
    }
    await userRepo.delete(id);
    return setJson({
      message: "用户信息已经删除",
    });
  },
  {
    isJwt: true,
    identity: Role.ROOT,
  },
);

export const PATCH = updateRole;
export const DELETE = deleteUser;
export const dynamic = "force-dynamic";

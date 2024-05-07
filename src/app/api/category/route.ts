import type { Category } from "@prisma/client";
import type { NextRequest } from "next/server";
import type { Schema } from "zod";
import z from "zod";
import { Role } from "~/lib/constants";
import { apiHandler, setJson } from "~/lib/middleware";
import { categoryRepo } from "~/server/category";

const createSchema: Schema = z.object({
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  colors: z.array(z.string()),
  level: z.number(),
  parentId: z.string().optional(),
  parent: z.lazy(() => createSchema).optional(),
  children: z.array(z.lazy(() => createSchema)).optional(),
});

const getCategory = apiHandler(async (req: NextRequest) => {
  const result = await categoryRepo.getAll();

  return setJson({
    data: result,
  });
});

const createCategory = apiHandler(
  async (req: NextRequest) => {
    const body: Category = await req.json();
    await categoryRepo.create(body);

    return setJson({
      message: "创建分类成功",
    });
  },
  {
    isJwt: true,
    identity: Role.ADMIN,
    schema: createSchema,
  },
);

export const GET = getCategory;
export const POST = createCategory;
export const dynamic = "force-dynamic";

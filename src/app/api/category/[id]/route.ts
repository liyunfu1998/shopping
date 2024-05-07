import type { Category } from "@prisma/client";
import type { NextRequest } from "next/server";
import type { Schema } from "zod";
import z from "zod";
import { Role } from "~/lib/constants";
import { apiHandler, setJson } from "~/lib/middleware";
import { categoryRepo } from "~/server/category";

const updateCategorySchema: Schema = z.object({
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  colors: z.array(z.any()),
  level: z.number(),
  children: z.array(z.lazy(() => updateCategorySchema)).optional(),
});
const updateCategory = apiHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    const body: Partial<Category> = await req.json();
    if (!id) throw new Error("id is required");
    if (!body) throw new Error("body is required");
    await categoryRepo.update(id, body);
    return setJson({
      message: "更新成功",
    });
  },
  {
    isJwt: true,
    identity: Role.ADMIN,
    schema: updateCategorySchema,
  },
);

export const PUT = updateCategory;
export const dynamic = "force-dynamic";

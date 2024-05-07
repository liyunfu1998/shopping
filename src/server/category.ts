import type { Category } from "@prisma/client";
import { db } from "./db";

const getAll = async (query = {}, filter = {}, sort = {}) => {
  const res = await db.category.findMany({
    where: {
      ...filter,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      parent: true,
      children: true,
    },
  });
  return res;
};

const getOne = async (id: string) => {
  const res = await db.category.findUnique({
    where: {
      id,
    },
  });
  return res;
};

const create = async (params: Category) => {
  const category = await db.category.findUnique({
    where: {
      name: params.name,
    },
  });
  if (category) {
    throw "分类已存在";
  }
  const res = await db.category.create({
    data: {
      ...params,
      children: {
        create: params.children,
      },
    },
  });
  return res;
};

const update = async (id: string, params: Partial<Category>) => {
  const res = await db.category.update({
    where: {
      id,
    },
    data: {
      ...params,
      children: {
        create: params.children,
      },
    },
  });
  return res;
};

export const categoryRepo = {
  getAll,
  getOne,
  create,
  update,
};

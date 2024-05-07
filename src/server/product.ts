import type { Product } from "@prisma/client";
import { db } from "./db";

const getAll = async (
  {
    page,
    page_size,
  }: {
    page: number;
    page_size: number;
  },
  filter = {},
  sort = {},
) => {
  const products = await db.product.findMany({
    where: {
      ...filter,
    },
    skip: page * page_size,
    take: page_size,
    orderBy: sort,
    include: {
      category: true,
      info: true,
      sizes: true,
      colors: true,
      specification: true,
    },
  });

  const productsLength = await db.product.count();

  return {
    products,
    productsLength,
    pagination: {
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: page_size * page < productsLength,
      lastPage: Math.ceil(productsLength / page_size),
    },
  };
};

const getById = async (id: string) => {
  const result = await db.product.findUnique({
    where: {
      id,
    },
  });
  if (!result) throw "Product not found";
  return result;
};

const create = async (params: Product) => {
  const product = await db.product.create({
    data: {
      ...params,
    },
  });

  return product;
};

const _delete = async (id: string) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) throw "Product not found";
  await db.product.delete({
    where: {
      id,
    },
  });
};

const update = async (id: string, params: Product) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) throw "Product not found";
  await db.product.update({
    data: {
      ...params,
    },
    where: {
      id,
    },
  });
};

export const productRepo = {
  getAll,
  getById,
  create,
  _delete,
  update,
};

import type { Address, User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { auth } from "~/lib/auth";
import { addressRepo } from "./address";
import { db } from "./db";

function exclude(user: User, keys: (keyof User)[]) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as keyof User)),
  );
}
export const getAll = async ({
  page,
  page_size,
}: {
  page: number;
  page_size: number;
}) => {
  const users = await db.user.findMany({
    skip: (page - 1) * page_size,
    take: page_size,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      addresses: {
        include: {
          province: true,
          city: true,
          area: true,
        },
      },
    },
  });

  const usersLength = await db.user.count();

  const usersWithoutPassword = users?.map((user) =>
    exclude(user, ["password"]),
  );

  return {
    users: usersWithoutPassword,
    usersLength,
    pagination: {
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: page_size * page < usersLength,
      lastPage: Math.ceil(usersLength / page_size),
    },
  };
};

const update = async (id: any, params: Partial<User>) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) throw "用户不存在";

  Object.assign(user, params);

  await db.user.update({
    data: params,
    where: {
      id,
    },
  });
};

const create = async (params: User) => {
  const { name, email, password } = params;
  if (
    await db.user.findUnique({
      where: {
        email,
      },
    })
  ) {
    const userExistsError = new Error("email" + email + "账户已存在");
    userExistsError.name = "UserExistsError";
    throw userExistsError;
  }

  if (!password) throw new Error("密码不存在");
  const hashPassword = await hash(password, 12);

  const {
    id,
    name: newName,
    email: newEmail,
    role: newRole,
    root: newRoot,
  } = await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  const token = auth.createAccessToken({ id });

  return {
    user: {
      name: newName,
      email: newEmail,
      role: newRole,
      root: newRoot,
    },
    token,
  };
};

const authenticate = async ({
  email,
  password,
}: Pick<User, "email" | "password">) => {
  if (!email || !password) return;
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user?.password) {
    throw "用户不存在";
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw "电子邮件地址或密码不正确";
  }

  const token = auth.createAccessToken({
    id: user.id,
  });

  return {
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      root: user.root,
    },
    token,
  };
};

const _delete = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw "用户不存在";
  }

  await db.user.delete({
    where: {
      id,
    },
  });
};

const resetPassword = async (id: string, password: string) => {
  const hashPassword = await hash(password, 12);

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw "用户不存在";
  }

  await db.user.update({
    data: {
      password: hashPassword,
    },
    where: {
      id,
    },
  });
};

const getById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
      include: {
        addresses: {
          include: {
            province: true,
            city: true,
            area: true,
          },
        },
      },
    });
  } catch {
    throw "User Not Found";
  }
};

const getOne = async (filter: any) => {
  try {
    return await db.user.findUnique({
      where: {
        ...filter,
      },
      include: {
        addresses: {
          include: {
            province: true,
            city: true,
            area: true,
          },
        },
      },
    });
  } catch {
    throw "无此数据";
  }
};

const updateUserAddress = async (id: string, params: Address) => {
  const count = await addressRepo.getCount(id);
  if (count >= 5) {
    throw "地址数量已达上限";
  }
  const user = await db.user.update({
    include: {
      addresses: true,
    },
    where: {
      id,
    },
    data: {
      addresses: {
        create: [
          {
            postalCode: params.postalCode,
            street: params.street,
            provinceCode: params.provinceCode,
            cityCode: params.cityCode,
            areaCode: params.areaCode,
          },
        ],
      },
    },
  });

  return user;
};

export const userRepo = {
  create,
  getAll,
  getById,
  getOne,
  update,
  delete: _delete,
  resetPassword,
  authenticate,
  updateUserAddress,
};

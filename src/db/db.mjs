import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
const prisma = new PrismaClient();

export const createUser = async (username, password) => {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: { username: username, password: hashedPassword },
    });
    return user;
  } catch (e) {
    throw Error("error while creating user: ", e);
  }
};

export const getUserByID = async (id) => {
  try {
    const user = await prisma.user.findMany({ where: { id: id } });
    return user[0];
  } catch (e) {
    throw Error("error while fetching user: ", e);
  }
};

export const getUserByUsername = async (username) => {
  try {
    const user = await prisma.user.findMany({ where: { username: username } });
    return user[0];
  } catch (e) {
    throw Error("error while fetching user: ", e);
  }
};

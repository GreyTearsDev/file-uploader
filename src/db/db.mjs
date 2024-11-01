import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const newUser = await prisma.user.create({
  data: {
    username: "annsnsna",
    password: "hdf",
  },
});

console.log(newUser);

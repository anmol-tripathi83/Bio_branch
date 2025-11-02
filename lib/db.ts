import {PrismaClient} from "@prisma/client";

// This is for production, it create multiple connections with the client again and again
// export const db = new PrismaClient();

// but for now, for development phase we use optimised one i.e we check there is connecn with Db exist in globalThis then we use it otherwise create new instance
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
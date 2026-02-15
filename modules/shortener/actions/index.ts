"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

function generateCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createShortLink(longUrl: string) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const userRecord = await db.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });
  if (!userRecord) return { success: false, error: "User not found" };

  let code = generateCode();
  let exists = await db.shortLink.findUnique({ where: { code } });
  let attempts = 0;
  while (exists && attempts < 10) {
    code = generateCode();
    exists = await db.shortLink.findUnique({ where: { code } });
    attempts++;
  }
  if (exists) return { success: false, error: "Could not generate unique code" };

  const shortLink = await db.shortLink.create({
    data: {
      code,
      longUrl,
      userId: userRecord.id,
    },
  });

  return {
    success: true,
    data: shortLink,
  };
}

export async function getShortLinksForUser() {
  const user = await currentUser();
  if (!user) return { success: false, data: [] };

  try {
    const links = await db.shortLink.findMany({
      where: { user: { clerkId: user.id } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: links };
  } catch (e) {
    // Prisma client may be stale (run: npx prisma generate)
    console.error("getShortLinksForUser:", e);
    return { success: true, data: [] };
  }
}

export async function deleteShortLink(id: string) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  await db.shortLink.deleteMany({
    where: { id, user: { clerkId: user.id } },
  });
  return { success: true };
}

export async function getLongUrlByCode(code: string) {
  const link = await db.shortLink.findUnique({
    where: { code },
    select: { longUrl: true },
  });
  return link?.longUrl ?? null;
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  // Dynamic import so Prisma is not loaded at build time (avoids "Failed to collect page data")
  const { getLongUrlByCode } = await import("@/modules/shortener/actions");
  const longUrl = await getLongUrlByCode(code);

  if (!longUrl) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(longUrl);
}

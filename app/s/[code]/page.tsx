import { getLongUrlByCode } from "@/modules/shortener/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ShortRedirectPage({ params }: PageProps) {
  const { code } = await params;
  const longUrl = await getLongUrlByCode(code);

  if (!longUrl) {
    redirect("/");
  }

  redirect(longUrl);
}

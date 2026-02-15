import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShortenerClient } from "./shortener-client";
import { getShortLinksForUser } from "@/modules/shortener/actions";

export default async function ShortenerPage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const result = await getShortLinksForUser();
  const links = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Link Shortener</h1>
        <p className="text-muted-foreground">
          Create short links that redirect to any URL. Share the short link instead of long URLs.
        </p>
      </div>
      <ShortenerClient initialLinks={links} />
    </div>
  );
}

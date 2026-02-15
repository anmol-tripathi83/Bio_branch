import { getCurrentUsername } from "@/modules/profile/actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { QrCodeClient } from "./qr-code-client";

export const dynamic = "force-dynamic";

export default async function QrCodePage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const profile = await getCurrentUsername();
  if (!profile?.username) {
    return redirect("/admin/settings");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
        <p className="text-muted-foreground">
          Generate a QR code for your profile link. Scan to open your BioBranch profile.
        </p>
      </div>
      <QrCodeClient username={profile.username} />
    </div>
  );
}

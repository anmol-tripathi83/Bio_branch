import { getCurrentUsername } from "@/modules/profile/actions";
import { SettingsForm } from "@/modules/settings/components/settings-form";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const profile = await getCurrentUsername();
  if (!profile) return redirect("/sign-in");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and social links.
        </p>
      </div>
      <SettingsForm
        initialData={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          bio: profile.bio ?? null,
          socialLinks: profile.socialLinks ?? [],
        }}
      />
    </div>
  );
}

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Instagram, Youtube, Mail, Pencil, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createUserProfile } from "@/modules/profile/actions";
import { addSocialLink, editSocialLink, deleteSocialLink } from "@/modules/links/actions";
import type { SocialLinkFormData } from "@/modules/links/components/social-link-modal";
import { SocialLinkModal } from "@/modules/links/components/social-link-modal";
import { checkProfileUsernameAvailability } from "@/modules/profile/actions";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "Max 50 characters"),
  lastName: z.string().max(50, "Max 50 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  imageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface SocialLink {
  id: string;
  platform: "instagram" | "youtube" | "email";
  url: string;
}

interface SettingsFormProps {
  initialData: {
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    bio: string | null;
    socialLinks: { id: string; platform: string; url: string }[];
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const { user } = useUser();
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>(
    (initialData.socialLinks as SocialLink[]) || []
  );
  const [socialModalOpen, setSocialModalOpen] = React.useState(false);
  const [editingSocialLink, setEditingSocialLink] = React.useState<SocialLink | null>(null);

  const defaultImage =
    user?.imageUrl ||
    `https://avatar.iran.liara.run/username?username=${encodeURIComponent(initialData.firstName || "user")}`;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      username: initialData.username || "",
      bio: initialData.bio || "",
      imageUrl: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (data.username !== (initialData.username || "")) {
      const availability = await checkProfileUsernameAvailability(data.username);
      if (!availability.available) {
        toast.error("Username is already taken.");
        return;
      }
    }
    try {
      const result = await createUserProfile({
        ...data,
        imageUrl: data.imageUrl || undefined,
      });
      if (result?.sucess) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  const onSocialSubmit = async (data: SocialLinkFormData) => {
    try {
      if (editingSocialLink) {
        const result = await editSocialLink(data, editingSocialLink.id);
        if (result?.success) {
          setSocialLinks((prev) =>
            prev.map((l) =>
              l.id === editingSocialLink.id ? { ...l, platform: data.platform, url: data.url } : l
            )
          );
          toast.success("Social link updated!");
        } else toast.error(result?.error || "Update failed.");
      } else {
        const result = await addSocialLink(data);
        if (result?.success && result?.data) {
          setSocialLinks((prev) => [
            ...prev,
            { id: result.data!.id, platform: data.platform, url: data.url },
          ]);
          toast.success("Social link added!");
        } else toast.error(result?.error || "Add failed.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setEditingSocialLink(null);
    }
  };

  const onDeleteSocialLink = async (id: string) => {
    try {
      const result = await deleteSocialLink(id);
      if (result?.success) {
        setSocialLinks((prev) => prev.filter((l) => l.id !== id));
        toast.success("Social link removed.");
      } else toast.error("Failed to remove.");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return Instagram;
      case "youtube":
        return Youtube;
      default:
        return Mail;
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name, username, and bio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={form.watch("imageUrl") || defaultImage} />
              <AvatarFallback>
                {(initialData.firstName?.[0] || "U") + (initialData.lastName?.[0] || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="imageUrl">Profile image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://..."
                {...form.register("imageUrl")}
              />
            </div>
          </div>
          <form onSubmit={form.handleSubmit(onProfileSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" {...form.register("firstName")} />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" {...form.register("lastName")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...form.register("username")} placeholder="yourname" />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Your profile: biobranch.com/{form.watch("username") || "username"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...form.register("bio")} rows={3} className="resize-none" />
              {form.formState.errors.bio && (
                <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
              )}
            </div>
            <Button type="submit">Save profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
          <CardDescription>Add Instagram, YouTube, or email links shown on your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              setEditingSocialLink(null);
              setSocialModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add social link
          </Button>
          <ul className="space-y-2">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <li
                  key={link.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">{link.platform}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingSocialLink(link);
                        setSocialModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteSocialLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          {socialLinks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No social links yet. Add one above.
            </p>
          )}
        </CardContent>
      </Card>

      <SocialLinkModal
        isOpen={socialModalOpen}
        onClose={() => {
          setSocialModalOpen(false);
          setEditingSocialLink(null);
        }}
        onSubmit={onSocialSubmit}
        defaultValues={editingSocialLink ? { platform: editingSocialLink.platform, url: editingSocialLink.url } : undefined}
      />
    </div>
  );
}

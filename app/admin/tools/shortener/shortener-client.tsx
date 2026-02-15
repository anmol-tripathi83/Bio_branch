"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Trash2, ExternalLink } from "lucide-react";
import { createShortLink, deleteShortLink } from "@/modules/shortener/actions";

const schema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
});

type FormData = z.infer<typeof schema>;

interface ShortLinkRow {
  id: string;
  code: string;
  longUrl: string;
  createdAt: Date;
}

interface ShortenerClientProps {
  initialLinks: ShortLinkRow[];
}

export function ShortenerClient({ initialLinks }: ShortenerClientProps) {
  const [links, setLinks] = React.useState<ShortLinkRow[]>(initialLinks);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const baseUrl = mounted && typeof window !== "undefined" ? window.location.origin : "";
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { longUrl: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createShortLink(data.longUrl);
      if (result.success && result.data) {
        setLinks((prev) => [
          { id: result.data!.id, code: result.data!.code, longUrl: result.data!.longUrl, createdAt: result.data!.createdAt },
          ...prev,
        ]);
        form.reset();
        toast.success("Short link created!");
      } else {
        toast.error(result.error || "Failed to create link.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const shortUrl = (code: string) => (baseUrl ? `${baseUrl}/s/${code}` : `/s/${code}`);

  const copyToClipboard = (code: string) => {
    const url = baseUrl ? `${baseUrl}/s/${code}` : `${window.location.origin}/s/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteShortLink(id);
      if (result.success) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
        toast.success("Link removed.");
      } else toast.error("Failed to delete.");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create short link</CardTitle>
          <CardDescription>
            Enter a long URL and we will generate a short link that redirects to it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="longUrl" className="sr-only">
                Long URL
              </Label>
              <Input
                id="longUrl"
                placeholder="https://example.com/very/long/url"
                {...form.register("longUrl")}
                className="font-mono"
              />
              {form.formState.errors.longUrl && (
                <p className="text-sm text-destructive">{form.formState.errors.longUrl.message}</p>
              )}
            </div>
            <Button type="submit">Shorten</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your short links</CardTitle>
          <CardDescription>Click copy to share, or delete to remove.</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No short links yet. Create one above.
            </p>
          ) : (
            <ul className="space-y-3">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm text-primary truncate">
                      {shortUrl(link.code)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      → {link.longUrl}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(link.code)}
                      title="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a
                        href={mounted ? `${window.location.origin}/s/${link.code}` : shortUrl(link.code)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(link.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

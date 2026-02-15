"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const QR_API = "https://api.qrserver.com/v1/create-qr-code";

interface QrCodeClientProps {
  username: string;
}

export function QrCodeClient({ username }: QrCodeClientProps) {
  const [url, setUrl] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const baseUrl = mounted && typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = url || (baseUrl ? `${baseUrl}/${username}` : `/${username}`);

  const qrImageUrl = `${QR_API}/?size=256x256&data=${encodeURIComponent(profileUrl)}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `biobranch-${username}-qr.png`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Your profile QR code</CardTitle>
        <CardDescription>
          Share this QR code so people can quickly open your BioBranch profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="qr-url">Link (optional)</Label>
          <Input
            id="qr-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={mounted ? `${baseUrl}/${username}` : `https://yoursite.com/${username}`}
            className="font-mono text-sm"
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageUrl}
              alt={`QR code for ${profileUrl}`}
              width={256}
              height={256}
              className="size-64 object-contain"
            />
          </div>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download QR code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

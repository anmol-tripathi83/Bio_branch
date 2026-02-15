"use client"
import { ModeToggle } from '@/components/theme-toggle'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { usePathname } from 'next/navigation'

const pageLabels: Record<string, string> = {
  "my-tree": "My Tree",
  overview: "Overview",
  settings: "Settings",
  analytics: "Analytics",
  "qr-code": "QR Code Generator",
  shortener: "Link Shortener",
};

const AppHeader = () => {
  const pathname = usePathname();
  const segments = pathname.split("/admin/").pop()?.split("/").filter(Boolean) || [];
  const lastSegment = segments[segments.length - 1] || "Dashboard";
  const currentPageLabel = pageLabels[lastSegment] ?? lastSegment.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="flex flex-1 items-center justify-between">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <ModeToggle />
      </Breadcrumb>
    </header>
  );
};

export default AppHeader;
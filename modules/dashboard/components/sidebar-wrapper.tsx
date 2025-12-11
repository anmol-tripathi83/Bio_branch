"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar";  // prpvided by shadCn

export function SidebarWrapper({   // then build the higher order function
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}
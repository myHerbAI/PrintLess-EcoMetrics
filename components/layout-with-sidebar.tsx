"use client"
import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

interface LayoutWithSidebarProps {
  children: ReactNode
}

export function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  // Client-side cookie reading
  const getSidebarState = () => {
    try {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sidebar:state="))
        ?.split("=")[1]
      return cookieValue === "true"
    } catch (e) {
      return true
    }
  }

  return (
    <SidebarProvider defaultOpen={typeof window !== "undefined" ? getSidebarState() : true}>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

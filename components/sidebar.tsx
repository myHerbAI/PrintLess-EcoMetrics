"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import {
  Home,
  Compass,
  Users,
  Bookmark,
  Settings,
  PenSquare,
  Search,
  Menu,
  Leaf,
  BarChart3,
  Calendar,
  LightbulbIcon,
  MessageSquare,
  Bell,
  LogOut,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const { user, isGuest, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Get context-aware actions based on current path
  const getContextActions = () => {
    if (pathname?.startsWith("/community")) {
      return [
        { icon: <Users size={18} />, label: "Find Groups", href: "/community/groups" },
        { icon: <MessageSquare size={18} />, label: "Start Discussion", href: "/community/new-discussion" },
      ]
    }

    if (pathname?.startsWith("/tips")) {
      return [
        { icon: <Bookmark size={18} />, label: "Saved Tips", href: "/my-content?tab=tips" },
        { icon: <LightbulbIcon size={18} />, label: "Submit Tip", href: "/tips/submit" },
      ]
    }

    if (pathname?.startsWith("/challenges")) {
      return [
        { icon: <Calendar size={18} />, label: "My Challenges", href: "/my-content?tab=challenges" },
        { icon: <Users size={18} />, label: "Leaderboard", href: "/challenges/leaderboard" },
      ]
    }

    return []
  }

  const contextActions = getContextActions()

  const sidebarContent = (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Leaf className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold">EcoWise</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 overflow-auto">
        <div className="flex flex-col gap-2 px-2">
          {/* Main Navigation */}
          <div className="flex flex-col gap-1 py-2">
            <h3 className="px-4 text-xs font-medium text-muted-foreground">Navigation</h3>
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                size="lg"
                className="w-full justify-start gap-2"
              >
                <Home size={18} />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/explore" onClick={() => setIsOpen(false)}>
              <Button
                variant={pathname?.startsWith("/explore") ? "secondary" : "ghost"}
                size="lg"
                className="w-full justify-start gap-2"
              >
                <Compass size={18} />
                <span>Explore</span>
                <Badge className="ml-auto bg-emerald-500 hover:bg-emerald-600">New</Badge>
              </Button>
            </Link>
            <Link href="/community" onClick={() => setIsOpen(false)}>
              <Button
                variant={pathname?.startsWith("/community") ? "secondary" : "ghost"}
                size="lg"
                className="w-full justify-start gap-2"
              >
                <Users size={18} />
                <span>Community</span>
              </Button>
            </Link>
            <Link href="/my-content" onClick={() => setIsOpen(false)}>
              <Button
                variant={pathname?.startsWith("/my-content") ? "secondary" : "ghost"}
                size="lg"
                className="w-full justify-start gap-2"
              >
                <Bookmark size={18} />
                <span>My Content</span>
                {!isGuest && <Badge className="ml-auto">3</Badge>}
              </Button>
            </Link>
            <Link href="/settings" onClick={() => setIsOpen(false)}>
              <Button
                variant={pathname?.startsWith("/settings") ? "secondary" : "ghost"}
                size="lg"
                className="w-full justify-start gap-2"
              >
                <Settings size={18} />
                <span>Settings</span>
              </Button>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-1 py-2">
            <h3 className="px-4 text-xs font-medium text-muted-foreground">Actions</h3>
            <Link href="/create-post" onClick={() => setIsOpen(false)}>
              <Button size="lg" className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700">
                <PenSquare size={18} />
                <span>Create Post</span>
              </Button>
            </Link>
            <Link href="/search" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="lg" className="w-full justify-start gap-2">
                <Search size={18} />
                <span>Search</span>
              </Button>
            </Link>
          </div>

          {/* Context-Aware Actions */}
          {contextActions.length > 0 && (
            <div className="flex flex-col gap-1 py-2">
              <h3 className="px-4 text-xs font-medium text-muted-foreground">Page Actions</h3>
              {contextActions.map((action, index) => (
                <Link key={index} href={action.href} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="lg" className="w-full justify-start gap-2">
                    {action.icon}
                    <span>{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Quick Links */}
          <div className="flex flex-col gap-1 py-2">
            <h3 className="px-4 text-xs font-medium text-muted-foreground">Quick Links</h3>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="lg" className="w-full justify-start gap-2">
                <BarChart3 size={18} />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/challenges" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="lg" className="w-full justify-start gap-2">
                <Calendar size={18} />
                <span>Challenges</span>
              </Button>
            </Link>
            <Link href="/tips" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="lg" className="w-full justify-start gap-2">
                <LightbulbIcon size={18} />
                <span>Tips</span>
              </Button>
            </Link>
          </div>
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="mt-auto border-t p-4">
        {user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {user.user_metadata?.first_name
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
                  : user.email}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={signOut}>
                    <LogOut size={18} />
                    <span className="sr-only">Log out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Log out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/signin" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )

  // For mobile, render a sheet that slides in
  if (isMobile) {
    return (
      <>
        <div className="flex h-14 items-center border-b px-4 lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="ml-4 flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">EcoWise</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search size={20} />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
                <span className="sr-only">Notifications</span>
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  // For desktop, render the sidebar directly
  return <aside className="hidden border-r bg-background lg:block lg:w-[280px]">{sidebarContent}</aside>
}

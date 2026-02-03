"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Home,
  BarChart3,
  Settings,
  Users,
  Bookmark,
  Search,
  PenSquare,
  Bell,
  LogOut,
  ChevronDown,
  Leaf,
  LightbulbIcon,
  Calendar,
  MessageSquare,
  HelpCircle,
  User,
  Gauge,
  Trophy,
  MapPin,
  Heart,
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, isGuest, signOut } = useAuth()

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "G"
    if (user.user_metadata?.first_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name?.[0] || ""}`
    }
    return user.email ? user.email[0].toUpperCase() : "U"
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-emerald-500">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700">{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium">
              {user?.user_metadata?.first_name
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
                : isGuest
                  ? "Guest User"
                  : user?.email || "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{isGuest ? "Limited access" : user?.email || ""}</p>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
            {isGuest ? "Guest" : "Member"}
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard Section - Always visible */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Home">
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                  <Link href="/dashboard">
                    <BarChart3 />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/my-content"} tooltip="My Content">
                  <Link href="/my-content">
                    <Bookmark />
                    <span>My Content</span>
                  </Link>
                </SidebarMenuButton>
                {!isGuest && <SidebarMenuBadge>3</SidebarMenuBadge>}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sustainability Section - Collapsible */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  <span>Sustainability</span>
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/calculator"} tooltip="Calculator">
                      <Link href="/calculator">
                        <Gauge />
                        <span>Carbon Calculator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/tips" || pathname?.startsWith("/tips/")}
                      tooltip="Tips"
                    >
                      <Link href="/tips">
                        <LightbulbIcon />
                        <span>Eco Tips</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/challenges" || pathname?.startsWith("/challenges/")}
                      tooltip="Challenges"
                    >
                      <Link href="/challenges">
                        <Trophy />
                        <span>Challenges</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/sustainability-tracker"} tooltip="Tracker">
                      <Link href="/sustainability-tracker">
                        <Calendar />
                        <span>Progress Tracker</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Community Section - Collapsible */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <span>Community</span>
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/community"} tooltip="Community">
                      <Link href="/community">
                        <Users />
                        <span>Community Hub</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/community/groups" || pathname?.startsWith("/community/groups/")}
                      tooltip="Groups"
                    >
                      <Link href="/community/groups">
                        <Heart />
                        <span>Groups</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-emerald-500 text-white">New</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/community/discussions"} tooltip="Discussions">
                      <Link href="/community/discussions">
                        <MessageSquare />
                        <span>Discussions</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/community/events"} tooltip="Events">
                      <Link href="/community/events">
                        <MapPin />
                        <span>Local Events</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Settings & Support - Collapsible */}
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-emerald-500" />
                  <span>Settings & Support</span>
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/settings/profile"} tooltip="Profile">
                      <Link href="/settings/profile">
                        <User />
                        <span>Profile Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/settings/notifications"}
                      tooltip="Notifications"
                    >
                      <Link href="/settings/notifications">
                        <Bell />
                        <span>Notifications</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/help"} tooltip="Help">
                      <Link href="/help">
                        <HelpCircle />
                        <span>Help & Support</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild variant="outline" tooltip="Create Post">
                  <Link href="/create-post">
                    <PenSquare />
                    <span>Create Post</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild variant="outline" tooltip="Search">
                  <Link href="/search">
                    <Search />
                    <span>Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} tooltip="Log Out">
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/signin" className="w-full">
              <SidebarMenuButton className="justify-center">Sign In</SidebarMenuButton>
            </Link>
            <Link href="/signup" className="w-full">
              <SidebarMenuButton className="justify-center bg-emerald-600 text-white hover:bg-emerald-700">
                Sign Up
              </SidebarMenuButton>
            </Link>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

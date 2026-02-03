"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calculator,
  Calendar,
  ChevronDown,
  Leaf,
  LightbulbIcon,
  Users,
  BookOpen,
  Home,
  Globe,
  Sparkles,
  Bookmark,
  Trophy,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserMenu } from "@/components/user-menu"

export function MegaMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      description: "Get an overview of your sustainability journey",
    },
    {
      name: "Sustainability Tracker",
      href: "/sustainability-tracker",
      icon: BarChart3,
      description: "Track your environmental impact over time",
    },
    {
      name: "Calculator",
      href: "/calculator",
      icon: Calculator,
      description: "Calculate your carbon footprint and other metrics",
    },
    {
      name: "Challenges",
      href: "/challenges",
      icon: Trophy,
      description: "Join sustainability challenges and track your progress",
    },
    {
      name: "Tips",
      href: "/tips",
      icon: LightbulbIcon,
      description: "Discover eco-friendly tips and practices",
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
      description: "Connect with others on their sustainability journey",
      submenu: [
        {
          name: "Groups",
          href: "/community/groups",
          icon: Users,
          description: "Join sustainability groups",
        },
        {
          name: "Events",
          href: "/community/events",
          icon: Calendar,
          description: "Find local sustainability events",
        },
        {
          name: "Forums",
          href: "/community/forums",
          icon: BookOpen,
          description: "Discuss sustainability topics",
        },
      ],
    },
    {
      name: "Explore",
      href: "/explore",
      icon: Globe,
      description: "Explore sustainability content and resources",
    },
    {
      name: "My Content",
      href: "/my-content",
      icon: Bookmark,
      description: "View your saved content and activity",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">EcoWise</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            {routes.map((route) =>
              route.submenu ? (
                <DropdownMenu key={route.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn("flex items-center gap-1 text-base", pathname === route.href && "text-emerald-600")}
                    >
                      {route.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {route.submenu.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={route.name}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-emerald-600",
                    pathname === route.href ? "text-emerald-600" : "text-foreground/60",
                  )}
                >
                  {route.name}
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1" asChild>
            <Link href="/sustainability-tracker">
              <BarChart3 className="h-4 w-4 mr-1" />
              Sustainability Tracker
            </Link>
          </Button>
          <UserMenu />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 sm:max-w-xs">
              <div className="flex items-center gap-2 mb-8">
                <Leaf className="h-6 w-6 text-emerald-500" />
                <span className="text-xl font-bold">EcoWise</span>
              </div>
              <nav className="grid gap-2 text-lg font-medium">
                {routes.map((route) =>
                  route.submenu ? (
                    <div key={route.name} className="grid gap-2">
                      <div className="flex items-center gap-2 py-2 text-foreground">
                        <route.icon className="h-5 w-5" />
                        <span>{route.name}</span>
                      </div>
                      <div className="grid gap-1 pl-8">
                        {route.submenu.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-2 py-2 text-base text-muted-foreground transition-colors hover:text-foreground",
                              pathname === item.href && "text-foreground",
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={route.name}
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 py-2 text-muted-foreground transition-colors hover:text-foreground",
                        pathname === route.href && "text-foreground",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      <span>{route.name}</span>
                    </Link>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="hidden md:block bg-muted/40 border-t">
        <div className="container flex h-10 items-center">
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/tips?category=energy" className="hover:text-foreground">
              Energy Tips
            </Link>
            <Link href="/tips?category=water" className="hover:text-foreground">
              Water Conservation
            </Link>
            <Link href="/tips?category=waste" className="hover:text-foreground">
              Waste Reduction
            </Link>
            <Link href="/tips?category=transport" className="hover:text-foreground">
              Sustainable Transport
            </Link>
            <Link href="/tips?category=food" className="hover:text-foreground">
              Sustainable Food
            </Link>
            <Link href="/ai-advisor" className="flex items-center gap-1 text-emerald-600 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Sustainability Advisor</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

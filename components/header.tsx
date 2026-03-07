import Link from "next/link"
import { Leaf, BarChart3 } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  activeLink?:
    | "dashboard"
    | "challenges"
    | "tips"
    | "community"
    | "home"
    | "calculator"
    | "sustainability-tracker"
    | "my-content"
}

export function Header({ activeLink }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold">EcoWise</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/dashboard"
            className={`text-sm font-medium ${activeLink === "dashboard" ? "text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/sustainability-tracker"
            className={`text-sm font-medium ${activeLink === "sustainability-tracker" ? "text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"}`}
          >
            Sustainability Tracker
          </Link>
          <Link
            href="/calculator"
            className={`text-sm font-medium ${activeLink === "calculator" ? "text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"}`}
          >
            Calculator
          </Link>
          <Link
            href="/challenges"
            className={`text-sm font-medium ${activeLink === "challenges" ? "text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"}`}
          >
            Challenges
          </Link>
          <Link
            href="/tips"
            className={`text-sm font-medium ${activeLink === "tips" ? "text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"}`}
          >
            Tips
          </Link>
          <Link
            href="/community"
            className={`text-sm font-medium ${activeLink === "community" ? "text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"}`}
          >
            Community
          </Link>
          <Link
            href="/my-content"
            className={`text-sm font-medium ${activeLink === "my-content" ? "text-emerald-600 underline underline-offset-4" : "hover:underline underline-offset-4"}`}
          >
            My Content
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1" asChild>
            <Link href="/sustainability-tracker">
              <BarChart3 className="h-4 w-4 mr-1" />
              Sustainability Tracker
            </Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

// Make sure to export the Header component as default as well
export default Header

import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-center gap-2 text-center md:flex-row md:gap-4">
        <p className="text-sm text-muted-foreground">
          Developed by{" "}
          <a
            href="https://myHerb.co.il"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-600 hover:underline"
          >
            myHerb.co.il
          </a>
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500" />
          <span>for the planet</span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} EcoWise. All rights reserved.</p>
      </div>
    </footer>
  )
}

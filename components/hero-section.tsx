import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Track Your Impact, <br />
                <span className="text-emerald-600">Save the Planet</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                EcoTrack helps you measure your carbon footprint, join sustainability challenges, and make a positive
                impact on the environment.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/sustainability-tracker">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Carbon tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Weekly challenges</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Community support</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-emerald-100 dark:bg-emerald-950/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-950">
                      <div className="mb-2 h-2 w-20 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                      <div className="h-24 rounded-md bg-emerald-100 dark:bg-emerald-900" />
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-950">
                      <div className="mb-2 h-2 w-20 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                      <div className="h-32 rounded-md bg-emerald-100 dark:bg-emerald-900" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-950">
                      <div className="mb-2 h-2 w-20 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                      <div className="h-32 rounded-md bg-emerald-100 dark:bg-emerald-900" />
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-950">
                      <div className="mb-2 h-2 w-20 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                      <div className="h-24 rounded-md bg-emerald-100 dark:bg-emerald-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

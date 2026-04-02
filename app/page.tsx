"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Leaf, 
  Search, 
  BarChart3, 
  Trophy, 
  Lightbulb, 
  Users, 
  ArrowRight,
  Sparkles,
  TrendingDown,
  Globe
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tips?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const quickLinks = [
    { label: "Calculate Carbon Footprint", href: "/calculator", icon: BarChart3 },
    { label: "Join a Challenge", href: "/challenges", icon: Trophy },
    { label: "Get Eco Tips", href: "/tips", icon: Lightbulb },
    { label: "AI Advisor", href: "/ai-advisor", icon: Sparkles },
  ]

  const features = [
    {
      title: "Track Your Impact",
      description: "Monitor your carbon footprint and see your progress over time with intuitive analytics.",
      image: "/images/feature-track.jpg",
      href: "/sustainability-tracker",
      stat: "2.5 tons",
      statLabel: "avg CO2 reduced per user"
    },
    {
      title: "Join Challenges",
      description: "Participate in community challenges and compete with others to make a bigger impact.",
      image: "/images/feature-challenge.jpg",
      href: "/challenges",
      stat: "50K+",
      statLabel: "active participants"
    },
    {
      title: "Discover Tips",
      description: "Learn practical ways to reduce your environmental footprint in daily life.",
      image: "/images/feature-tips.jpg",
      href: "/tips",
      stat: "200+",
      statLabel: "actionable tips"
    },
  ]

  const stats = [
    { value: "1.2M", label: "Trees Equivalent Saved", icon: Leaf },
    { value: "50K", label: "Active Users", icon: Users },
    { value: "30%", label: "Avg Footprint Reduction", icon: TrendingDown },
    { value: "120", label: "Countries Reached", icon: Globe },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section - Google-like clean design */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-sustainability.jpg"
            alt="Nature background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50">
              <Leaf className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            <span className="text-foreground">Make Every Action</span>
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">Count for the Planet</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-pretty">
            Track your environmental impact, join sustainability challenges, and discover 
            practical ways to live more sustainably.
          </p>

          {/* Search Bar - Google-style */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search for eco-friendly tips, challenges, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-lg rounded-full border-2 border-muted hover:border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-lg transition-all"
              />
              <Button 
                type="submit"
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Action Links */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button 
                  variant="outline" 
                  className="rounded-full gap-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-50/50 dark:bg-emerald-950/20 border-y">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-3">
                  <stat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Sustainability Journey Starts Here</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover powerful tools and resources to help you make a positive impact on the environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <Card className="overflow-hidden h-full transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-2xl font-bold">{feature.stat}</span>
                      <p className="text-xs opacity-90">{feature.statLabel}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <span className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Advisor CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-800 dark:to-emerald-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <span className="text-sm font-medium uppercase tracking-wider opacity-90">AI-Powered</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Personalized Sustainability Advice
              </h2>
              <p className="text-emerald-100 text-lg mb-6">
                Our AI advisor analyzes your lifestyle and provides tailored recommendations 
                to help you reduce your environmental footprint effectively.
              </p>
              <Link href="/ai-advisor">
                <Button size="lg" variant="secondary" className="rounded-full gap-2">
                  <Sparkles className="h-5 w-5" />
                  Try AI Advisor
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-white/20">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white/20 rounded-2xl rounded-tl-none p-4 text-white text-sm max-w-xs">
                        Based on your commute, switching to public transit twice a week could save 1.2 tons of CO2 annually.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-white/20">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white/20 rounded-2xl rounded-tl-none p-4 text-white text-sm max-w-xs">
                        Your energy usage is 20% above average. Here are 5 quick wins...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with like-minded individuals, share your progress, and inspire others on their sustainability journey.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/community">
              <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Users className="h-5 w-5" />
                Explore Community
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="rounded-full gap-2">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

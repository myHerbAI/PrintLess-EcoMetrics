import Link from "next/link"
import { ArrowRight, BookOpen, Globe, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExplorePage() {
  // Sample featured content
  const featuredContent = [
    {
      id: "sustainable-home",
      title: "Guide to a Sustainable Home",
      description: "Comprehensive tips for reducing your home's environmental impact.",
      category: "Guides",
      image: "/placeholder.svg?height=200&width=400",
      author: "EcoWise Team",
    },
    {
      id: "carbon-footprint",
      title: "Understanding Your Carbon Footprint",
      description: "Learn how to calculate and reduce your personal carbon emissions.",
      category: "Education",
      image: "/placeholder.svg?height=200&width=400",
      author: "Climate Experts",
    },
    {
      id: "zero-waste",
      title: "Zero Waste Starter Kit",
      description: "Essential items and practices to begin your zero waste journey.",
      category: "Guides",
      image: "/placeholder.svg?height=200&width=400",
      author: "Sustainability Advocates",
    },
  ]

  // Sample categories
  const categories = [
    {
      name: "Guides",
      icon: BookOpen,
      description: "Step-by-step guides for sustainable living",
      count: 24,
    },
    {
      name: "Education",
      icon: Globe,
      description: "Learn about environmental issues and solutions",
      count: 18,
    },
    {
      name: "Case Studies",
      icon: Leaf,
      description: "Real-world examples of sustainability in action",
      count: 12,
    },
  ]

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">Explore Sustainability Resources</h1>
        <p className="text-lg text-muted-foreground">
          Discover guides, articles, and resources to help you on your sustainability journey.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Content</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredContent.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">{item.category}</span>
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">By {item.author}</div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/explore/${item.id}`}>Read more</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.name} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">{category.count} resources</div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/explore/category/${category.name.toLowerCase()}`}>Browse</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Join Our Newsletter</CardTitle>
            <CardDescription>
              Get the latest sustainability tips, resources, and updates delivered to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button>Subscribe</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

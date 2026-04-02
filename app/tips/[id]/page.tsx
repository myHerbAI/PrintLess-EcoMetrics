"use client"

import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Check, Leaf } from "lucide-react"
import Header from "@/components/header" // Updated import
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

// Mock tip data - in a real app, this would come from an API or database
const tipsData = {
  "reduce-standby-power": {
    title: "Reduce Standby Power",
    description: "Unplug electronics when not in use to save energy and reduce your carbon footprint.",
    category: "Energy",
    impact: "Medium",
    content: `
      <h2>What is Standby Power?</h2>
      <p>Standby power, also known as vampire power or phantom load, is the electricity consumed by appliances and electronics when they are switched off or in standby mode. This can account for 5-10% of residential energy use.</p>
      
      <h2>Why It Matters</h2>
      <p>Reducing standby power can save you money on your electricity bill and reduce your carbon footprint. The average U.S. household spends $100 per year powering devices that are turned off or in standby mode.</p>
      
      <h2>How to Reduce Standby Power</h2>
      <ul>
        <li>Unplug chargers when not in use</li>
        <li>Use power strips to completely cut power to multiple devices at once</li>
        <li>Look for ENERGY STAR certified products, which have lower standby power consumption</li>
        <li>Use smart power strips that automatically cut power to devices in standby mode</li>
        <li>Configure your devices to use energy-saving modes</li>
      </ul>
      
      <h2>Environmental Impact</h2>
      <p>If every U.S. household reduced their standby power consumption by half, it would be equivalent to removing about 1 million cars from the road in terms of carbon emissions.</p>
    `,
    relatedTips: ["led-bulbs", "cold-water-laundry"],
  },
  "reusable-bags": {
    title: "Use Reusable Bags",
    description: "Bring your own bags when shopping to reduce plastic waste.",
    category: "Waste",
    impact: "High",
    content: `
      <h2>The Problem with Plastic Bags</h2>
      <p>Single-use plastic bags are used for an average of 12 minutes but can take up to 1,000 years to decompose. They contribute to pollution, harm wildlife, and clog waterways.</p>
      
      <h2>Benefits of Reusable Bags</h2>
      <p>Reusable bags are durable, can hold more items than plastic bags, and significantly reduce waste. A single reusable bag can replace hundreds of single-use plastic bags over its lifetime.</p>
      
      <h2>Tips for Using Reusable Bags</h2>
      <ul>
        <li>Keep reusable bags in your car so you don't forget them</li>
        <li>Fold compact bags and keep them in your purse or backpack</li>
        <li>Wash your reusable bags regularly to keep them clean</li>
        <li>Use different bags for different purposes (e.g., separate bags for meat and produce)</li>
        <li>Collect bags made from different materials for different needs</li>
      </ul>
      
      <h2>Environmental Impact</h2>
      <p>If everyone in the U.S. used just one reusable bag instead of a single-use plastic bag each week, it would prevent billions of plastic bags from entering landfills and the environment each year.</p>
    `,
    relatedTips: ["avoid-single-use-plastics", "compost-food-scraps"],
  },
}

export default function TipPage({ params }: { params: { id: string } }) {
  const { id } = params
  const tip = tipsData[id as keyof typeof tipsData] || {
    title: "Eco-Friendly Tip",
    description: "This tip helps you reduce your environmental impact.",
    category: "General",
    impact: "Medium",
    content: "<p>Detailed information about this eco-friendly tip will be available soon.</p>",
    relatedTips: [],
  }

  const [isSaved, setIsSaved] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isGuest } = useAuth()

  const handleSaveTip = () => {
    setIsSaved(!isSaved)

    if (!isSaved) {
      if (isGuest) {
        // Store in localStorage for guest users
        const savedTips = JSON.parse(localStorage.getItem("guestSavedTips") || "[]")
        savedTips.push({
          id,
          savedAt: new Date().toISOString(),
        })
        localStorage.setItem("guestSavedTips", JSON.stringify(savedTips))
      }

      toast({
        title: "Tip Saved",
        description: `You've saved "${tip.title}" to your collection.`,
      })
    } else {
      if (isGuest) {
        // Remove from localStorage
        const savedTips = JSON.parse(localStorage.getItem("guestSavedTips") || "[]")
        const updatedTips = savedTips.filter((savedTip: any) => savedTip.id !== id)
        localStorage.setItem("guestSavedTips", JSON.stringify(updatedTips))
      }

      toast({
        title: "Tip Removed",
        description: `You've removed "${tip.title}" from your collection.`,
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeLink="tips" />
      <main className="flex-1 bg-muted/40">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push("/tips")}>
                  Back to Tips
                </Button>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {tip.category}
                </Badge>
                <Badge
                  variant={tip.impact === "Low" ? "outline" : tip.impact === "Medium" ? "secondary" : "default"}
                  className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800"
                >
                  {tip.impact} Impact
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{tip.title}</h1>
              <p className="text-muted-foreground">{tip.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>How to Implement This Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-emerald max-w-none space-y-4">
                    {tip.content.split('\n\n').map((paragraph, index) => {
                      const trimmed = paragraph.trim()
                      if (trimmed.startsWith('<h2>')) {
                        const text = trimmed.replace(/<\/?h2>/g, '')
                        return <h2 key={index} className="text-xl font-bold mt-6 mb-2">{text}</h2>
                      }
                      if (trimmed.startsWith('<ul>')) {
                        const items = trimmed.match(/<li>(.*?)<\/li>/g) || []
                        return (
                          <ul key={index} className="list-disc pl-5 space-y-1">
                            {items.map((item, i) => (
                              <li key={i}>{item.replace(/<\/?li>/g, '')}</li>
                            ))}
                          </ul>
                        )
                      }
                      if (trimmed.startsWith('<p>')) {
                        const text = trimmed.replace(/<\/?p>/g, '')
                        return <p key={index} className="text-muted-foreground">{text}</p>
                      }
                      if (trimmed) {
                        return <p key={index} className="text-muted-foreground">{trimmed}</p>
                      }
                      return null
                    })}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/tips")}>
                    Back to Tips
                  </Button>
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    className={isSaved ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    onClick={handleSaveTip}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {isSaved ? "Saved" : "Save Tip"}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Leaf className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Environmental Impact</p>
                          <p className="text-sm text-muted-foreground">{tip.impact} impact on the environment</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Difficulty Level</p>
                          <p className="text-sm text-muted-foreground">Easy to implement</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {tip.relatedTips && tip.relatedTips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Related Tips</CardTitle>
                      <CardDescription>Other tips you might find useful</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tip.relatedTips.map((relatedTipId) => {
                          const relatedTip = tipsData[relatedTipId as keyof typeof tipsData]
                          return relatedTip ? (
                            <div key={relatedTipId} className="flex items-start gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Leaf className="h-4 w-4" />
                              </div>
                              <div>
                                <Link href={`/tips/${relatedTipId}`}>
                                  <p className="font-medium hover:text-emerald-600">{relatedTip.title}</p>
                                </Link>
                                <p className="text-sm text-muted-foreground">{relatedTip.description}</p>
                              </div>
                            </div>
                          ) : null
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

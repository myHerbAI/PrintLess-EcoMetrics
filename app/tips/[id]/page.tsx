"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Check, Leaf, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

// Tip content structure
interface TipContent {
  title: string
  description: string
  category: string
  impact: string
  sections: {
    heading: string
    content: string | string[]
  }[]
  relatedTips: string[]
}

// Mock tip data - in a real app, this would come from an API or database
const tipsData: Record<string, TipContent> = {
  "reduce-standby-power": {
    title: "Reduce Standby Power",
    description: "Unplug electronics when not in use to save energy and reduce your carbon footprint.",
    category: "Energy",
    impact: "Medium",
    sections: [
      {
        heading: "What is Standby Power?",
        content: "Standby power, also known as vampire power or phantom load, is the electricity consumed by appliances and electronics when they are switched off or in standby mode. This can account for 5-10% of residential energy use."
      },
      {
        heading: "Why It Matters",
        content: "Reducing standby power can save you money on your electricity bill and reduce your carbon footprint. The average U.S. household spends $100 per year powering devices that are turned off or in standby mode."
      },
      {
        heading: "How to Reduce Standby Power",
        content: [
          "Unplug chargers when not in use",
          "Use power strips to completely cut power to multiple devices at once",
          "Look for ENERGY STAR certified products, which have lower standby power consumption",
          "Use smart power strips that automatically cut power to devices in standby mode",
          "Configure your devices to use energy-saving modes"
        ]
      },
      {
        heading: "Environmental Impact",
        content: "If every U.S. household reduced their standby power consumption by half, it would be equivalent to removing about 1 million cars from the road in terms of carbon emissions."
      }
    ],
    relatedTips: ["led-bulbs", "cold-water-laundry"],
  },
  "reusable-bags": {
    title: "Use Reusable Bags",
    description: "Bring your own bags when shopping to reduce plastic waste.",
    category: "Waste",
    impact: "High",
    sections: [
      {
        heading: "The Problem with Plastic Bags",
        content: "Single-use plastic bags are used for an average of 12 minutes but can take up to 1,000 years to decompose. They contribute to pollution, harm wildlife, and clog waterways."
      },
      {
        heading: "Benefits of Reusable Bags",
        content: "Reusable bags are durable, can hold more items than plastic bags, and significantly reduce waste. A single reusable bag can replace hundreds of single-use plastic bags over its lifetime."
      },
      {
        heading: "Tips for Using Reusable Bags",
        content: [
          "Keep reusable bags in your car so you don't forget them",
          "Fold compact bags and keep them in your purse or backpack",
          "Wash your reusable bags regularly to keep them clean",
          "Use different bags for different purposes (e.g., separate bags for meat and produce)",
          "Collect bags made from different materials for different needs"
        ]
      },
      {
        heading: "Environmental Impact",
        content: "If everyone in the U.S. used just one reusable bag instead of a single-use plastic bag each week, it would prevent billions of plastic bags from entering landfills and the environment each year."
      }
    ],
    relatedTips: ["avoid-single-use-plastics", "compost-food-scraps"],
  },
  "led-bulbs": {
    title: "Switch to LED Bulbs",
    description: "Replace traditional bulbs with LED alternatives to save energy.",
    category: "Energy",
    impact: "Medium",
    sections: [
      {
        heading: "Why LED Bulbs?",
        content: "LED bulbs use up to 90% less energy than incandescent bulbs and last 25 times longer, making them both environmentally friendly and cost-effective."
      }
    ],
    relatedTips: ["reduce-standby-power"],
  },
  "cold-water-laundry": {
    title: "Wash Clothes in Cold Water",
    description: "Using cold water for laundry saves energy and protects your clothes.",
    category: "Energy",
    impact: "Low",
    sections: [
      {
        heading: "Energy Savings",
        content: "About 90% of the energy used to wash clothes goes to heating the water. Switching to cold water can significantly reduce your energy consumption."
      }
    ],
    relatedTips: ["reduce-standby-power"],
  }
}

export default function TipPage({ params }: { params: { id: string } }) {
  const { id } = params
  const tip = tipsData[id as keyof typeof tipsData] || {
    title: "Eco-Friendly Tip",
    description: "This tip helps you reduce your environmental impact.",
    category: "General",
    impact: "Medium",
    sections: [
      {
        heading: "Coming Soon",
        content: "Detailed information about this eco-friendly tip will be available soon."
      }
    ],
    relatedTips: [],
  }

  const [isSaved, setIsSaved] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { isGuest } = useAuth()

  const handleSaveTip = () => {
    setIsSaved(!isSaved)

    if (!isSaved) {
      if (isGuest) {
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
        const savedTips = JSON.parse(localStorage.getItem("guestSavedTips") || "[]")
        const updatedTips = savedTips.filter((savedTip: { id: string }) => savedTip.id !== id)
        localStorage.setItem("guestSavedTips", JSON.stringify(updatedTips))
      }

      toast({
        title: "Tip Removed",
        description: `You've removed "${tip.title}" from your collection.`,
      })
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/tips")}
              className="w-fit gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tips
            </Button>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
              >
                {tip.category}
              </Badge>
              <Badge className={getImpactColor(tip.impact)}>
                {tip.impact} Impact
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">{tip.title}</h1>
            <p className="text-muted-foreground text-lg">{tip.description}</p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>How to Implement This Tip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {tip.sections.map((section, index) => (
                  <div key={index}>
                    <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
                    {Array.isArray(section.content) ? (
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {section.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">{section.content}</p>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => router.push("/tips")}>
                  Back to Tips
                </Button>
                <Button
                  variant={isSaved ? "default" : "outline"}
                  className={isSaved ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  onClick={handleSaveTip}
                >
                  <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved" : "Save Tip"}
                </Button>
              </CardFooter>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Environmental Impact</p>
                        <p className="text-sm text-muted-foreground">{tip.impact} impact on the environment</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        <Check className="h-5 w-5" />
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
                          <Link 
                            key={relatedTipId} 
                            href={`/tips/${relatedTipId}`}
                            className="flex items-start gap-3 group"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                              <Leaf className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-emerald-600 transition-colors">
                                {relatedTip.title}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {relatedTip.description}
                              </p>
                            </div>
                          </Link>
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
    </div>
  )
}

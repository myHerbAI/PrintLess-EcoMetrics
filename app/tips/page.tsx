"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { TipCard } from "@/components/tip-card"

// Expanded tips data with more detailed information
const tipsData = [
  {
    id: "reduce-standby-power",
    title: "Reduce Standby Power",
    description: "Unplug electronics when not in use to save energy and reduce your carbon footprint.",
    category: "Energy",
    impact: "Medium" as const,
    averages: {
      national: "1,200 kWh/year",
      global: "1,000 kWh/year",
      sustainable: "400 kWh/year",
    },
    metrics: {
      unit: "kWh saved per year",
      value: 300,
    },
  },
  {
    id: "reusable-bags",
    title: "Use Reusable Bags",
    description: "Bring your own bags when shopping to reduce plastic waste.",
    category: "Waste",
    impact: "High" as const,
    averages: {
      national: "365 bags/year",
      global: "300 bags/year",
      sustainable: "0 bags/year",
    },
    metrics: {
      unit: "plastic bags avoided per year",
      value: 365,
    },
  },
  {
    id: "shorter-showers",
    title: "Shorter Showers",
    description: "Cut your shower time by 2 minutes to save up to 10 gallons of water.",
    category: "Water",
    impact: "Medium" as const,
    averages: {
      national: "17 gallons/shower",
      global: "15 gallons/shower",
      sustainable: "10 gallons/shower",
    },
    metrics: {
      unit: "gallons saved per shower",
      value: 5,
    },
  },
  {
    id: "led-bulbs",
    title: "LED Light Bulbs",
    description: "Replace incandescent bulbs with LED bulbs to use 75% less energy.",
    category: "Energy",
    impact: "High" as const,
    averages: {
      national: "1,000 kWh/year",
      global: "850 kWh/year",
      sustainable: "250 kWh/year",
    },
    metrics: {
      unit: "kWh saved per year",
      value: 750,
    },
  },
  {
    id: "compost-food-scraps",
    title: "Compost Food Scraps",
    description: "Compost food waste to reduce methane emissions from landfills.",
    category: "Waste",
    impact: "Medium" as const,
    averages: {
      national: "220 lbs/year",
      global: "200 lbs/year",
      sustainable: "0 lbs/year",
    },
    metrics: {
      unit: "lbs diverted from landfill per year",
      value: 220,
    },
  },
  {
    id: "fix-leaky-faucets",
    title: "Fix Leaky Faucets",
    description: "A dripping faucet can waste up to 3,000 gallons of water per year.",
    category: "Water",
    impact: "Medium" as const,
    averages: {
      national: "10,000 gallons/year",
      global: "9,000 gallons/year",
      sustainable: "7,000 gallons/year",
    },
    metrics: {
      unit: "gallons saved per year",
      value: 3000,
    },
  },
  {
    id: "cold-water-laundry",
    title: "Wash Clothes in Cold Water",
    description: "Using cold water for laundry saves energy and keeps clothes looking new longer.",
    category: "Energy",
    impact: "Medium" as const,
    averages: {
      national: "220 loads/year",
      global: "200 loads/year",
      sustainable: "200 loads/year (cold)",
    },
    metrics: {
      unit: "kWh saved per year",
      value: 500,
    },
  },
  {
    id: "avoid-single-use-plastics",
    title: "Avoid Single-Use Plastics",
    description: "Choose reusable alternatives to single-use plastic items like straws and utensils.",
    category: "Waste",
    impact: "High" as const,
    averages: {
      national: "185 lbs/year",
      global: "150 lbs/year",
      sustainable: "20 lbs/year",
    },
    metrics: {
      unit: "lbs of plastic waste avoided per year",
      value: 165,
    },
  },
  {
    id: "collect-rainwater",
    title: "Collect Rainwater",
    description: "Use a rain barrel to collect water for your garden and plants.",
    category: "Water",
    impact: "Medium" as const,
    averages: {
      national: "30% outdoor water use",
      global: "25% outdoor water use",
      sustainable: "10% outdoor water use",
    },
    metrics: {
      unit: "gallons collected per year",
      value: 600,
    },
  },
  {
    id: "plant-based-meals",
    title: "Eat More Plant-Based Meals",
    description: "Reduce meat consumption by incorporating more plant-based meals into your diet.",
    category: "Food",
    impact: "High" as const,
    averages: {
      national: "220 lbs meat/year",
      global: "180 lbs meat/year",
      sustainable: "90 lbs meat/year",
    },
    metrics: {
      unit: "kg CO2e saved per year",
      value: 700,
    },
  },
  {
    id: "public-transportation",
    title: "Use Public Transportation",
    description: "Take public transportation instead of driving to reduce emissions and traffic congestion.",
    category: "Transport",
    impact: "High" as const,
    averages: {
      national: "4.6 tons CO2/year",
      global: "3.8 tons CO2/year",
      sustainable: "1.0 ton CO2/year",
    },
    metrics: {
      unit: "kg CO2 saved per year",
      value: 1200,
    },
  },
  {
    id: "seasonal-local-food",
    title: "Buy Seasonal and Local Food",
    description:
      "Purchase locally grown, seasonal produce to reduce transportation emissions and support local farmers.",
    category: "Food",
    impact: "Medium" as const,
    averages: {
      national: "1,500 food miles/year",
      global: "1,200 food miles/year",
      sustainable: "400 food miles/year",
    },
    metrics: {
      unit: "kg CO2e saved per year",
      value: 150,
    },
  },
]

export default function TipsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredTips, setFilteredTips] = useState(tipsData)
  const [savedTipIds, setSavedTipIds] = useState<string[]>([])
  const [filters, setFilters] = useState({
    impact: [] as string[],
    sortBy: "newest"
  })
  
  const { toast } = useToast()
  
  // Load saved tips on component mount
  useEffect(() => {
    const loadSavedTips = () => {
      try {
        const savedTips = JSON.parse(localStorage.getItem("guestSavedTips") || "[]")
        const savedIds = savedTips.map((tip: any) => tip.id)
        setSavedTipIds(savedIds)
      } catch (error) {
        console.error("Error loading saved tips:", error)
      }
    }
    
    loadSavedTips()
  }, [])
  
  // Filter tips based on search query, category, and other filters
  useEffect(() => {
    let filtered = [...tipsData]
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        tip => 
          tip.title.toLowerCase().includes(query) || 
          tip.description.toLowerCase().includes(query) ||
          tip.category.toLowerCase().includes(query)
      )
    }
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(tip => tip.category.toLowerCase() === activeCategory.toLowerCase())
    }
    
    // Filter by impact
    if (filters.impact.length > 0) {
      filtered = filtered.filter(tip => filters.impact.includes(tip.impact))
    }
    
    // Sort tips
    switch (filters.sortBy) {
      case "impact-high":
        filtered.sort((a, b) => {
          const impactOrder = { "High": 3, "Medium": 2, "Low": 1 }
          return impactOrder[b.impact as keyof typeof impactOrder] - impactOrder[a.impact as keyof typeof impactOrder]
        })
        break
      case "impact-low":
        filtered.sort((a, b) => {
          const impactOrder = { "High": 3, "Medium": 2, "Low": 1 }
          return impactOrder[a.impact as keyof typeof impactOrder] - impactOrder[b.impact as keyof typeof impactOrder]
        })
        break
      case "a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        // Default sorting (newest) - we'll just use the original order
        break
    }
    
    setFilteredTips(filtered)
  }, [searchQuery, activeCategory, filters])
  
  // Handle tip save status change
  const handleSaveStatusChange = (id: string, isPinned: boolean) => {
    if (isPinned) {
      setSavedTipIds(prev => [...prev, id])
    } else {
      setSavedTipIds(prev => prev.filter(tipId => tipId !== id))
    }
  }
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }
  
  // Handle impact filter change
  const handleImpactChange = (impact: string) => {
    setFilters(prev => {
      const newImpact = prev.impact.includes(impact)
        ? prev.impact.filter(i => i !== impact)
        : [...prev.impact, impact]
      
      return { ...prev, impact: newImpact }
    })
  }

  // Get unique categories from tips data
  const categories = ["all", ...Array.from(new Set(tipsData.map(tip => tip.category.toLowerCase())))]

  return (
    <div className="container px-4 py-6 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Eco-Friendly Tips</h1>
          <p className="text-muted-foreground">
            Discover simple actions that can make a big difference for our planet.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
            <Input 
              type="search" 
              placeholder="Search tips..." 
              className="h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="sm" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filter & Sort</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Tips</SheetTitle>
                  <SheetDescription>
                    Customize which sustainability tips you see
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-medium">Impact Level</h3>
                    <div className="grid gap-2">
                      {["High", "Medium", "Low"].map((impact) => (
                        <div key={impact} className="flex items-center gap-2">
                          <Checkbox 
                            id={`impact-${impact}`} 
                            checked={filters.impact.includes(impact)}
                            onCheckedChange={() => handleImpactChange(impact)}
                          />
                          <Label htmlFor={`impact-${impact}`} className="flex items-center gap-2">
                            {impact}
                            <Badge 
                              variant="outline" 
                              className={
                                impact === "High" 
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100" 
                                  : impact === "Medium"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              }
                            >
                              {impact}
                            </Badge>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-medium">Sort By</h3>
                    <Select 
                      value={filters.sortBy} 
                      onValueChange={(value) => setFilters({...filters, sortBy: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sort order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="impact-high">Highest Impact First</SelectItem>
                        <SelectItem value="impact-low">Lowest Impact First</SelectItem>
                        <SelectItem value="a-z">A to Z</SelectItem>
                        <SelectItem value="z-a">Z to A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        
        {/* Tips Grid */}
        {filteredTips.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTips.map((tip) => (
              <TipCard
                key={tip.id}
                id={tip.id}
                title={tip.title}
                description={tip.description}
                category={tip.category}
                impact={tip.impact}
                averages={tip.averages}
                metrics={tip.metrics}
                onSaveStatusChange={handleSaveStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No tips found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
                setFilters({ impact: [], sortBy: "newest" })
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

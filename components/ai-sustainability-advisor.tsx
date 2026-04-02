"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Leaf, Home, Car, ShoppingBag, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AISustainabilityAdvisor() {
  const [activeTab, setActiveTab] = useState("home")
  const [formData, setFormData] = useState({
    homeEnergy: 50,
    transportation: 50,
    diet: 50,
    shopping: 50,
    homeType: "apartment",
    carType: "gasoline",
    dietType: "omnivore",
    flightsPerYear: "0-1",
  })
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({ ...formData, [name]: value[0] })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const generateResults = () => {
    setLoading(true)
    setTimeout(() => {
      const homeScore = calculateHomeScore()
      const transportScore = calculateTransportScore()
      const dietScore = calculateDietScore()
      const shoppingScore = calculateShoppingScore()
      const totalScore = homeScore + transportScore + dietScore + shoppingScore
      const recommendations = generateRecommendations()
      setResults({
        totalScore,
        breakdown: { home: homeScore, transport: transportScore, diet: dietScore, shopping: shoppingScore },
        averages: { home: 2.5, transport: 4.2, diet: 3.1, shopping: 2.8 },
        recommendations,
      })
      setLoading(false)
    }, 1500)
  }

  const calculateHomeScore = () => {
    let score = formData.homeEnergy / 20
    if (formData.homeType === "house") score += 1
    else if (formData.homeType === "apartment") score += 0.5
    return Number.parseFloat(score.toFixed(1))
  }

  const calculateTransportScore = () => {
    let score = formData.transportation / 20
    if (formData.carType === "electric") score -= 0.8
    else if (formData.carType === "hybrid") score -= 0.4
    else if (formData.carType === "gasoline") score += 0.5
    if (formData.flightsPerYear === "5+") score += 2
    else if (formData.flightsPerYear === "2-4") score += 1
    return Number.parseFloat(score.toFixed(1))
  }

  const calculateDietScore = () => {
    let score = formData.diet / 20
    if (formData.dietType === "vegan") score -= 1
    else if (formData.dietType === "vegetarian") score -= 0.5
    else if (formData.dietType === "omnivore") score += 0.5
    return Number.parseFloat(score.toFixed(1))
  }

  const calculateShoppingScore = () => {
    return Number.parseFloat((formData.shopping / 20).toFixed(1))
  }

  const generateRecommendations = () => {
    const recommendations = []
    if (formData.homeEnergy > 70) {
      recommendations.push({
        category: "home",
        title: "Reduce Standby Power",
        description: "Unplug electronics when not in use or use smart power strips to cut standby power consumption.",
        impact: "high",
        savings: "Up to 10% on electricity bill",
      })
    }
    if (formData.homeType === "house") {
      recommendations.push({
        category: "home",
        title: "Improve Home Insulation",
        description: "Adding proper insulation can significantly reduce heating and cooling needs.",
        impact: "high",
        savings: "Up to 20% on heating/cooling costs",
      })
    }
    if (formData.carType === "gasoline" && formData.transportation > 60) {
      recommendations.push({
        category: "transport",
        title: "Consider Carpooling",
        description: "Share rides with colleagues or neighbors to reduce emissions and save on fuel costs.",
        impact: "medium",
        savings: "Up to 50% on commuting costs",
      })
    }
    if (formData.flightsPerYear === "5+") {
      recommendations.push({
        category: "transport",
        title: "Offset Flight Emissions",
        description: "Consider purchasing carbon offsets for your flights to mitigate their environmental impact.",
        impact: "medium",
        savings: "Carbon neutral travel",
      })
    }
    if (formData.dietType === "omnivore") {
      recommendations.push({
        category: "diet",
        title: "Meatless Mondays",
        description: "Start with one day a week of plant-based meals to reduce your carbon footprint.",
        impact: "medium",
        savings: "Up to 8% reduction in food-related emissions",
      })
    }
    if (formData.shopping > 60) {
      recommendations.push({
        category: "shopping",
        title: "Buy Second-hand",
        description: "Consider second-hand items before buying new to reduce resource consumption.",
        impact: "medium",
        savings: "Varies by item",
      })
    }
    return recommendations
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "home":
        return <Home className="h-4 w-4" />
      case "transport":
        return <Car className="h-4 w-4" />
      case "diet":
        return <Utensils className="h-4 w-4" />
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />
      default:
        return <Leaf className="h-4 w-4" />
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            AI Sustainability Advisor
          </CardTitle>
          <CardDescription>
            Answer a few questions to get personalized sustainability recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="home">
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger value="transport">
                <Car className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Transport</span>
              </TabsTrigger>
              <TabsTrigger value="diet">
                <Utensils className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Diet</span>
              </TabsTrigger>
              <TabsTrigger value="shopping">
                <ShoppingBag className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Shopping</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Home Type</Label>
                <Select value={formData.homeType} onValueChange={(value) => handleSelectChange("homeType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Energy Usage</Label>
                  <span className="text-sm text-muted-foreground">{formData.homeEnergy}%</span>
                </div>
                <Slider
                  value={[formData.homeEnergy]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleSliderChange("homeEnergy", value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Average</span>
                  <span>High</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transport" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Primary Vehicle Type</Label>
                <Select value={formData.carType} onValueChange={(value) => handleSelectChange("carType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No car / Public transit</SelectItem>
                    <SelectItem value="electric">Electric vehicle</SelectItem>
                    <SelectItem value="hybrid">Hybrid vehicle</SelectItem>
                    <SelectItem value="gasoline">Gasoline vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Flights per Year</Label>
                <Select
                  value={formData.flightsPerYear}
                  onValueChange={(value) => handleSelectChange("flightsPerYear", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select flights per year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 flights</SelectItem>
                    <SelectItem value="2-4">2-4 flights</SelectItem>
                    <SelectItem value="5+">5+ flights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Daily Transportation</Label>
                  <span className="text-sm text-muted-foreground">{formData.transportation}%</span>
                </div>
                <Slider
                  value={[formData.transportation]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleSliderChange("transportation", value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Average</span>
                  <span>High</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diet" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Diet Type</Label>
                <Select value={formData.dietType} onValueChange={(value) => handleSelectChange("dietType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Food Waste</Label>
                  <span className="text-sm text-muted-foreground">{formData.diet}%</span>
                </div>
                <Slider
                  value={[formData.diet]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleSliderChange("diet", value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Average</span>
                  <span>High</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shopping" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Shopping Frequency</Label>
                  <span className="text-sm text-muted-foreground">{formData.shopping}%</span>
                </div>
                <Slider
                  value={[formData.shopping]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleSliderChange("shopping", value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimal</span>
                  <span>Average</span>
                  <span>Frequent</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={generateResults}
            disabled={loading}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Get My Recommendations
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Results</CardTitle>
          <CardDescription>
            {results ? "Based on your inputs, here are your sustainability insights" : "Complete the form to see your personalized results"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!results ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-3">
              <Leaf className="h-12 w-12 text-emerald-200" />
              <p>Fill out the form and click &quot;Get My Recommendations&quot; to see your personalized sustainability analysis.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Total Carbon Score</span>
                  <span className="text-2xl font-bold text-emerald-600">{results.totalScore.toFixed(1)} tons CO₂/yr</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {Object.entries(results.breakdown).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(key)}
                        <span className="text-sm font-medium capitalize">{key}</span>
                      </div>
                      <span className="text-lg font-semibold">{(value as number).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground ml-1">tons</span>
                    </div>
                  ))}
                </div>
              </div>

              {results.recommendations.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Personalized Recommendations</h3>
                  <div className="space-y-3">
                    {results.recommendations.map((rec: any, i: number) => (
                      <div key={i} className="p-3 border rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(rec.category)}
                            <span className="font-medium text-sm">{rec.title}</span>
                          </div>
                          <Badge className={getImpactColor(rec.impact)} variant="outline">
                            {rec.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <p className="text-xs text-emerald-600 font-medium">{rec.savings}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

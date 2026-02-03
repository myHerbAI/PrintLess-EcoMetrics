"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Send, Lightbulb, BarChart3, Leaf, ThumbsUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TipCard } from "@/components/tip-card"

interface AiSuggestion {
  id: string
  title: string
  description: string
  category: string
  impact: "Low" | "Medium" | "High"
  content?: string
  averages?: {
    national?: number
    global?: number
    sustainable?: number
  }
  metrics?: {
    unit: string
    value: number
  }
}

export function AiAdvisor() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([])
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm your AI Sustainability Advisor. How can I help you today?" },
  ])

  // Form state for guided mode
  const [formData, setFormData] = useState({
    area: "home",
    goal: "reduce_energy",
    effort: 50,
    household: 2,
  })

  const { toast } = useToast()

  const handleSendMessage = () => {
    if (!query.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: query }])
    setIsGenerating(true)

    // Simulate AI response
    setTimeout(() => {
      // Generate a mock response
      const aiResponse = generateMockResponse(query)
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
      setIsGenerating(false)
      setQuery("")
    }, 1500)
  }

  const handleGuidedSubmit = () => {
    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      // Generate mock suggestions based on form data
      const mockSuggestions = generateMockSuggestions(formData)
      setSuggestions(mockSuggestions)
      setIsGenerating(false)

      toast({
        title: "AI Suggestions Generated",
        description: `Generated ${mockSuggestions.length} personalized sustainability tips based on your inputs.`,
      })
    }, 2000)
  }

  const generateMockResponse = (userQuery: string): string => {
    const responses = [
      "Based on your interest in reducing energy consumption, I recommend switching to LED bulbs which use 75% less energy than incandescent lighting. This small change can save around 1,000 kg of CO2 emissions per year for an average household.",
      "To reduce your water footprint, consider installing a low-flow showerhead. This can reduce your water usage by up to 40%, saving approximately 11,000 gallons of water per year for a family of four.",
      "For sustainable transportation, try carpooling or using public transit once a week. This could reduce your carbon emissions by about 10% annually, which is significant considering transportation accounts for nearly 30% of an average person's carbon footprint.",
      "Reducing meat consumption, particularly beef, can have a major impact on your carbon footprint. Even replacing beef with chicken once a week can reduce associated emissions by about 270 kg CO2e per year.",
      "Consider composting your food waste. An average household can divert about 150 kg of food waste from landfills annually, reducing methane emissions and creating nutrient-rich soil for gardening.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generateMockSuggestions = (data: typeof formData): AiSuggestion[] => {
    const suggestions: AiSuggestion[] = []

    if (data.area === "home" && data.goal === "reduce_energy") {
      suggestions.push({
        id: "led-lighting",
        title: "Switch to LED Lighting",
        description: "Replace all incandescent bulbs with LED alternatives to significantly reduce energy consumption.",
        category: "Energy",
        impact: "High",
        content: `<p>LED bulbs use at least 75% less energy than incandescent lighting and last 25 times longer.</p>
                 <p>This simple switch can save an average household about $75 in energy costs per year.</p>
                 <h3 class="text-lg font-semibold mt-4">Implementation Steps</h3>
                 <ul class="list-disc pl-5 mt-2">
                   <li>Identify all incandescent bulbs in your home</li>
                   <li>Purchase LED replacements with equivalent brightness (lumens)</li>
                   <li>Properly dispose of old bulbs at a recycling center</li>
                 </ul>`,
        averages: {
          national: "1,000 kWh/year",
          global: "850 kWh/year",
          sustainable: "250 kWh/year",
        },
        metrics: {
          unit: "kWh saved per year",
          value: 750,
        },
      })

      suggestions.push({
        id: "smart-thermostat",
        title: "Install a Smart Thermostat",
        description: "Use a programmable thermostat to optimize heating and cooling based on your schedule.",
        category: "Energy",
        impact: "Medium",
        content: `<p>Smart thermostats can reduce your heating and cooling costs by 10-15% by automatically adjusting temperatures when you're away or asleep.</p>
                 <p>Many utility companies offer rebates for installing smart thermostats, making them even more cost-effective.</p>
                 <h3 class="text-lg font-semibold mt-4">Benefits</h3>
                 <ul class="list-disc pl-5 mt-2">
                   <li>Reduced energy consumption</li>
                   <li>Lower utility bills</li>
                   <li>Remote control via smartphone</li>
                   <li>Usage insights and optimization suggestions</li>
                 </ul>`,
        averages: {
          national: "900 kWh/year",
          global: "850 kWh/year",
          sustainable: "700 kWh/year",
        },
        metrics: {
          unit: "kWh saved per year",
          value: 200,
        },
      })

      suggestions.push({
        id: "energy-audit",
        title: "Conduct a Home Energy Audit",
        description: "Identify energy inefficiencies in your home to target improvements for maximum impact.",
        category: "Energy",
        impact: "High",
        content: `<p>A professional energy audit can identify where your home is losing energy and what you can do to save money and improve comfort.</p>
                 <p>Many utility companies offer free or discounted energy audits to their customers.</p>
                 <h3 class="text-lg font-semibold mt-4">What to Expect</h3>
                 <ul class="list-disc pl-5 mt-2">
                   <li>Blower door tests to find air leaks</li>
                   <li>Thermographic scans to detect insulation gaps</li>
                   <li>HVAC system efficiency assessment</li>
                   <li>Detailed report with prioritized recommendations</li>
                 </ul>`,
        averages: {
          national: "10,400 kWh/year",
          global: "9,500 kWh/year",
          sustainable: "6,000 kWh/year",
        },
        metrics: {
          unit: "Potential kWh saved per year",
          value: 3000,
        },
      })
    } else if (data.area === "transport" && data.goal === "reduce_emissions") {
      suggestions.push({
        id: "bike-commuting",
        title: "Commute by Bicycle",
        description: "Replace car trips under 5 miles with bicycle transportation when possible.",
        category: "Transport",
        impact: "High",
        averages: {
          national: "4.6 tons CO2/year",
          global: "3.8 tons CO2/year",
          sustainable: "1.0 ton CO2/year",
        },
        metrics: {
          unit: "kg CO2 saved per year",
          value: 500,
        },
      })
    }

    return suggestions
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          <CardTitle>AI Sustainability Advisor</CardTitle>
        </div>
        <CardDescription>Get personalized sustainability recommendations powered by AI</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="guided" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Guided Recommendations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4 pt-4">
            <div className="h-[400px] overflow-y-auto border rounded-md p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-emerald-600 text-white" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-300"></div>
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about sustainable practices, carbon footprint reduction, or eco-friendly tips..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!query.trim() || isGenerating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="guided" className="space-y-6 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area of Focus</Label>
                  <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
                    <SelectTrigger id="area">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home & Energy</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="food">Food & Diet</SelectItem>
                      <SelectItem value="consumption">Consumption & Waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reduce_energy">Reduce Energy Usage</SelectItem>
                      <SelectItem value="reduce_emissions">Lower Carbon Emissions</SelectItem>
                      <SelectItem value="save_money">Save Money</SelectItem>
                      <SelectItem value="improve_health">Improve Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effort">Effort Level</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="effort"
                      min={0}
                      max={100}
                      step={10}
                      value={[formData.effort]}
                      onValueChange={(value) => setFormData({ ...formData, effort: value[0] })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{formData.effort}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Easy Changes</span>
                    <span>Major Lifestyle</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="household">Household Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="household"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.household]}
                      onValueChange={(value) => setFormData({ ...formData, household: value[0] })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{formData.household}</span>
                  </div>
                </div>

                <Button
                  onClick={handleGuidedSubmit}
                  disabled={isGenerating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      Generating Recommendations...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Personalized Recommendations
                    </>
                  )}
                </Button>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-medium">Your Sustainability Profile</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Focus Area</div>
                    <div className="flex items-center gap-2 mt-1">
                      {formData.area === "home" && <Leaf className="h-4 w-4 text-emerald-500" />}
                      {formData.area === "transport" && <Leaf className="h-4 w-4 text-emerald-500" />}
                      {formData.area === "food" && <Leaf className="h-4 w-4 text-emerald-500" />}
                      {formData.area === "consumption" && <Leaf className="h-4 w-4 text-emerald-500" />}
                      <span className="capitalize">{formData.area.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Primary Goal</div>
                    <div className="flex items-center gap-2 mt-1">
                      <ThumbsUp className="h-4 w-4 text-emerald-500" />
                      <span className="capitalize">{formData.goal.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Effort Level</div>
                    <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                      <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${formData.effort}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Household Size</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: formData.household }).map((_, i) => (
                        <div key={i} className="h-4 w-4 rounded-full bg-emerald-200"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Your Personalized Recommendations</h3>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((suggestion) => (
                    <TipCard
                      key={suggestion.id}
                      id={suggestion.id}
                      title={suggestion.title}
                      description={suggestion.description}
                      category={suggestion.category}
                      impact={suggestion.impact}
                      content={suggestion.content}
                      averages={suggestion.averages}
                      metrics={suggestion.metrics}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Powered by EcoWise AI</div>
        <div>Recommendations are personalized based on your inputs</div>
      </CardFooter>
    </Card>
  )
}

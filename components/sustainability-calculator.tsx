"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Home, ShoppingBag, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { logActivity, type ActivityData } from "@/app/actions/carbon-footprint"

// Carbon footprint factors (approximate values in kg CO2e)
const CARBON_FACTORS = {
  transportation: {
    car: 0.12, // per km
    bus: 0.05, // per km
    train: 0.03, // per km
    plane: 0.2, // per km
    bike: 0, // per km
    walk: 0, // per km
  },
  home: {
    electricity: 0.4, // per kWh
    "natural-gas": 0.2, // per kWh
    "heating-oil": 0.25, // per kWh
    propane: 0.22, // per kWh
    water: 0.001, // per liter
  },
  food: {
    meat: 6.0, // per kg
    dairy: 1.5, // per kg
    vegetables: 0.4, // per kg
    fruits: 0.5, // per kg
    grains: 0.8, // per kg
    processed: 2.0, // per kg
  },
  consumption: {
    clothing: 15, // per item
    electronics: 100, // per item
    household: 20, // per item
    "personal-care": 5, // per item
    other: 10, // per item
  },
}

export function SustainabilityCalculator() {
  const [calculatorType, setCalculatorType] = useState("transportation")
  const [results, setResults] = useState<{
    carbonFootprint: number
    waterUsage: number
    energyConsumption: number
    wasteGeneration: number
  } | null>(null)

  // Transportation inputs
  const [transportType, setTransportType] = useState("car")
  const [distance, setDistance] = useState(10)
  const [frequency, setFrequency] = useState(5) // times per week

  // Home inputs
  const [electricityUsage, setElectricityUsage] = useState(250) // kWh per month
  const [gasUsage, setGasUsage] = useState(50) // cubic meters per month
  const [waterUsage, setWaterUsage] = useState(5000) // liters per month
  const [householdSize, setHouseholdSize] = useState(2)

  // Food inputs
  const [meatConsumption, setMeatConsumption] = useState(3) // meals per week
  const [dairyConsumption, setDairyConsumption] = useState(7) // servings per week
  const [localFoodPercentage, setLocalFoodPercentage] = useState(30) // percentage

  // Consumption inputs
  const [monthlyPurchases, setMonthlyPurchases] = useState(2) // items per month
  const [recyclingRate, setRecyclingRate] = useState(50) // percentage

  const { toast } = useToast()
  const { user, isGuest } = useAuth()

  const calculateFootprint = () => {
    let carbonFootprint = 0
    let waterUsage = 0
    let energyConsumption = 0
    let wasteGeneration = 0

    // Calculate based on the selected calculator type
    switch (calculatorType) {
      case "transportation":
        // Carbon footprint from transportation (kg CO2e)
        carbonFootprint =
          distance *
          frequency *
          52 *
          CARBON_FACTORS.transportation[transportType as keyof typeof CARBON_FACTORS.transportation]

        // Energy consumption (kWh equivalent)
        energyConsumption = distance * frequency * 52 * 0.5 // Approximate energy usage
        break

      case "home":
        // Carbon footprint from home energy (kg CO2e)
        carbonFootprint =
          (electricityUsage * CARBON_FACTORS.home.electricity + gasUsage * CARBON_FACTORS.home["natural-gas"]) * 12

        // Water usage (liters per year)
        waterUsage = waterUsage * 12

        // Energy consumption (kWh per year)
        energyConsumption = (electricityUsage + gasUsage * 10) * 12 // Convert gas to kWh equivalent

        // Adjust for household size
        carbonFootprint = carbonFootprint / householdSize
        waterUsage = waterUsage / householdSize
        energyConsumption = energyConsumption / householdSize
        break

      case "food":
        // Carbon footprint from food (kg CO2e)
        const meatFootprint = meatConsumption * 52 * CARBON_FACTORS.food.meat
        const dairyFootprint = dairyConsumption * 52 * CARBON_FACTORS.food.dairy
        carbonFootprint = meatFootprint + dairyFootprint

        // Adjust for local food (reduces footprint)
        carbonFootprint = carbonFootprint * (1 - (localFoodPercentage / 100) * 0.3)

        // Water usage (liters per year) - approximate
        waterUsage = meatConsumption * 52 * 1500 + dairyConsumption * 52 * 500

        // Waste generation (kg per year) - approximate
        wasteGeneration = (meatConsumption + dairyConsumption) * 52 * 0.2
        break

      case "consumption":
        // Carbon footprint from consumption (kg CO2e)
        carbonFootprint = monthlyPurchases * 12 * CARBON_FACTORS.consumption.other

        // Waste generation (kg per year)
        wasteGeneration = monthlyPurchases * 12 * 2

        // Adjust for recycling
        wasteGeneration = wasteGeneration * (1 - recyclingRate / 100)
        break
    }

    // Convert to tons for display
    const results = {
      carbonFootprint: Number.parseFloat((carbonFootprint / 1000).toFixed(2)),
      waterUsage: Math.round(waterUsage),
      energyConsumption: Math.round(energyConsumption),
      wasteGeneration: Number.parseFloat(wasteGeneration.toFixed(2)),
    }

    setResults(results)

    // Save the activity if needed
    if (calculatorType === "transportation" || calculatorType === "home") {
      const activityData: ActivityData = {
        type: calculatorType as any,
        value: results.carbonFootprint,
        date: new Date().toISOString().split("T")[0],
        details: {
          calculatedValue: true,
          ...results,
        },
      }

      if (isGuest) {
        // Store in localStorage for guest users
        const storedActivities = JSON.parse(localStorage.getItem("guestActivities") || "[]")
        storedActivities.push({
          ...activityData,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem("guestActivities", JSON.stringify(storedActivities))

        toast({
          title: "Calculation saved",
          description: "Your sustainability data has been calculated and saved locally.",
        })
      } else if (user) {
        // Use server action for authenticated users
        logActivity(user.id, activityData).then((result) => {
          if (result.success) {
            toast({
              title: "Calculation saved",
              description: "Your sustainability data has been calculated and saved to your profile.",
            })
          }
        })
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sustainability Calculator</CardTitle>
        <CardDescription>Calculate your environmental impact based on your lifestyle choices</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={calculatorType} onValueChange={setCalculatorType} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transportation" className="flex flex-col items-center gap-1 py-2">
              <Car className="h-4 w-4" />
              <span className="text-xs">Transport</span>
            </TabsTrigger>
            <TabsTrigger value="home" className="flex flex-col items-center gap-1 py-2">
              <Home className="h-4 w-4" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger value="food" className="flex flex-col items-center gap-1 py-2">
              <Utensils className="h-4 w-4" />
              <span className="text-xs">Food</span>
            </TabsTrigger>
            <TabsTrigger value="consumption" className="flex flex-col items-center gap-1 py-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs">Consumption</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transportation" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="transport-type">Transportation Type</Label>
                <Select value={transportType} onValueChange={setTransportType}>
                  <SelectTrigger id="transport-type">
                    <SelectValue placeholder="Select transportation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="plane">Plane</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                    <SelectItem value="walk">Walking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="distance">Daily Distance (km)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="distance"
                    min={1}
                    max={100}
                    step={1}
                    value={[distance]}
                    onValueChange={(value) => setDistance(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{distance}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="frequency">Days Per Week</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="frequency"
                    min={1}
                    max={7}
                    step={1}
                    value={[frequency]}
                    onValueChange={(value) => setFrequency(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{frequency}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="home" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="electricity">Monthly Electricity Usage (kWh)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="electricity"
                    min={50}
                    max={1000}
                    step={10}
                    value={[electricityUsage]}
                    onValueChange={(value) => setElectricityUsage(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{electricityUsage}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gas">Monthly Natural Gas Usage (cubic meters)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="gas"
                    min={0}
                    max={200}
                    step={5}
                    value={[gasUsage]}
                    onValueChange={(value) => setGasUsage(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{gasUsage}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="water">Monthly Water Usage (liters)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="water"
                    min={1000}
                    max={20000}
                    step={500}
                    value={[waterUsage]}
                    onValueChange={(value) => setWaterUsage(value[0])}
                    className="flex-1"
                  />
                  <span className="w-16 text-center">{waterUsage}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="household">Household Size</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="household"
                    min={1}
                    max={10}
                    step={1}
                    value={[householdSize]}
                    onValueChange={(value) => setHouseholdSize(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{householdSize}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="food" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meat">Meat Meals Per Week</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="meat"
                    min={0}
                    max={21}
                    step={1}
                    value={[meatConsumption]}
                    onValueChange={(value) => setMeatConsumption(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{meatConsumption}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dairy">Dairy Servings Per Week</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="dairy"
                    min={0}
                    max={21}
                    step={1}
                    value={[dairyConsumption]}
                    onValueChange={(value) => setDairyConsumption(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{dairyConsumption}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="local">Local Food Percentage</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="local"
                    min={0}
                    max={100}
                    step={5}
                    value={[localFoodPercentage]}
                    onValueChange={(value) => setLocalFoodPercentage(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{localFoodPercentage}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consumption" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchases">New Items Purchased Per Month</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="purchases"
                    min={0}
                    max={20}
                    step={1}
                    value={[monthlyPurchases]}
                    onValueChange={(value) => setMonthlyPurchases(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{monthlyPurchases}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="recycling">Recycling Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="recycling"
                    min={0}
                    max={100}
                    step={5}
                    value={[recyclingRate]}
                    onValueChange={(value) => setRecyclingRate(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{recyclingRate}%</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {results && (
          <div className="mt-6 rounded-lg border p-4">
            <h3 className="font-medium text-lg mb-2">Your Environmental Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Carbon Footprint</p>
                <p className="text-xl font-bold">{results.carbonFootprint} tons CO2e/year</p>
              </div>
              {results.waterUsage > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Water Usage</p>
                  <p className="text-xl font-bold">{results.waterUsage.toLocaleString()} liters/year</p>
                </div>
              )}
              {results.energyConsumption > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Energy Consumption</p>
                  <p className="text-xl font-bold">{results.energyConsumption.toLocaleString()} kWh/year</p>
                </div>
              )}
              {results.wasteGeneration > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Waste Generation</p>
                  <p className="text-xl font-bold">{results.wasteGeneration} kg/year</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={calculateFootprint}>
          Calculate Impact
        </Button>
      </CardFooter>
    </Card>
  )
}

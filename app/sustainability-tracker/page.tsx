"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Car,
  Home,
  ShoppingBag,
  Utensils,
  Leaf,
  Droplets,
  Zap,
  Trash2,
  Download,
  Mail,
  Share2,
  Printer,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define the types for our sustainability data
interface SustainabilityData {
  carbonFootprint: number
  waterUsage: number
  energyConsumption: number
  wasteGeneration: number
  breakdown: {
    transportation: number
    housing: number
    food: number
    goods: number
    services: number
  }
}

// Carbon footprint factors (approximate values)
const CARBON_FACTORS = {
  transportation: {
    car: 0.12, // kg CO2e per km
    bus: 0.05, // kg CO2e per km
    train: 0.03, // kg CO2e per km
    plane: 0.2, // kg CO2e per km
    bike: 0, // kg CO2e per km
    walk: 0, // kg CO2e per km
  },
  housing: {
    electricity: 0.4, // kg CO2e per kWh
    naturalGas: 0.2, // kg CO2e per kWh
    heatingOil: 0.25, // kg CO2e per kWh
    propane: 0.22, // kg CO2e per kWh
    water: 0.001, // kg CO2e per liter
  },
  food: {
    meat: 6.0, // kg CO2e per kg
    dairy: 1.5, // kg CO2e per kg
    vegetables: 0.4, // kg CO2e per kg
    fruits: 0.5, // kg CO2e per kg
    grains: 0.8, // kg CO2e per kg
    processed: 2.0, // kg CO2e per kg
  },
  goods: {
    clothing: 15, // kg CO2e per item
    electronics: 100, // kg CO2e per item
    household: 20, // kg CO2e per item
    personalCare: 5, // kg CO2e per item
  },
}

// Water usage factors (approximate values in liters)
const WATER_FACTORS = {
  transportation: {
    car: 0, // liters per km
    bus: 0, // liters per km
    train: 0, // liters per km
    plane: 0, // liters per km
    bike: 0, // liters per km
    walk: 0, // liters per km
  },
  housing: {
    shower: 10, // liters per minute
    bath: 80, // liters per bath
    toilet: 6, // liters per flush
    laundry: 50, // liters per load
    dishwasher: 15, // liters per load
    handWashing: 8, // liters per minute
    lawn: 10, // liters per square meter
  },
  food: {
    meat: 15000, // liters per kg
    dairy: 1000, // liters per kg
    vegetables: 300, // liters per kg
    fruits: 700, // liters per kg
    grains: 1500, // liters per kg
    processed: 2000, // liters per kg
  },
}

// Energy consumption factors (approximate values in kWh)
const ENERGY_FACTORS = {
  housing: {
    heating: 0.1, // kWh per square meter per day
    cooling: 0.05, // kWh per square meter per day
    lighting: 0.01, // kWh per square meter per day
    appliances: 5, // kWh per day
    waterHeating: 4, // kWh per day
  },
}

// Waste generation factors (approximate values in kg)
const WASTE_FACTORS = {
  food: 0.5, // kg per day
  packaging: 0.2, // kg per day
  paper: 0.1, // kg per day
  plastic: 0.1, // kg per day
  glass: 0.05, // kg per day
  metal: 0.05, // kg per day
  electronic: 0.01, // kg per day
}

// Colors for charts
const COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444"]

export default function SustainabilityTrackerPage() {
  // All the state variables and functions remain the same...
  const { toast } = useToast()
  const { user, isGuest } = useAuth()
  const tabsRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [emailAddress, setEmailAddress] = useState("")
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)

  // State for active tab
  const [activeTab, setActiveTab] = useState("input")

  // State for input values
  const [transportationType, setTransportationType] = useState("car")
  const [transportationDistance, setTransportationDistance] = useState(20)
  const [transportationFrequency, setTransportationFrequency] = useState(5)

  const [housingSize, setHousingSize] = useState(100)
  const [housingType, setHousingType] = useState("apartment")
  const [electricityUsage, setElectricityUsage] = useState(250)
  const [heatingType, setHeatingType] = useState("naturalGas")
  const [heatingUsage, setHeatingUsage] = useState(100)
  const [waterUsage, setWaterUsage] = useState(150)

  const [dietType, setDietType] = useState("omnivore")
  const [meatConsumption, setMeatConsumption] = useState(3)
  const [dairyConsumption, setDairyConsumption] = useState(5)
  const [localFoodPercentage, setLocalFoodPercentage] = useState(30)

  const [clothingPurchases, setClothingPurchases] = useState(2)
  const [electronicsPurchases, setElectronicsPurchases] = useState(0.5)
  const [householdPurchases, setHouseholdPurchases] = useState(1)
  const [recyclingRate, setRecyclingRate] = useState(50)

  // State for calculated results
  const [results, setResults] = useState<SustainabilityData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Load saved data if available
  useEffect(() => {
    const savedData = localStorage.getItem("sustainabilityData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setResults(parsedData)
        // Don't automatically switch to results tab on initial load
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }

    // Load jsPDF and html2canvas dynamically
    const loadExportLibraries = async () => {
      try {
        await import("jspdf")
        await import("html2canvas")
      } catch (error) {
        console.error("Error loading export libraries:", error)
      }
    }

    loadExportLibraries()
  }, [])

  // Calculate sustainability metrics
  const calculateSustainability = () => {
    setIsCalculating(true)

    try {
      // Calculate carbon footprint
      const transportationCarbon =
        transportationDistance *
        transportationFrequency *
        52 * // weeks per year
        CARBON_FACTORS.transportation[transportationType as keyof typeof CARBON_FACTORS.transportation]

      const housingCarbon =
        (electricityUsage * CARBON_FACTORS.housing.electricity +
          heatingUsage * CARBON_FACTORS.housing[heatingType as keyof typeof CARBON_FACTORS.housing]) *
        12 // months per year

      const foodCarbon =
        (meatConsumption * 52 * CARBON_FACTORS.food.meat + dairyConsumption * 52 * CARBON_FACTORS.food.dairy) *
        (1 - (localFoodPercentage / 100) * 0.3) // Adjustment for local food

      const goodsCarbon =
        (clothingPurchases * CARBON_FACTORS.goods.clothing +
          electronicsPurchases * CARBON_FACTORS.goods.electronics +
          householdPurchases * CARBON_FACTORS.goods.household) *
        12 // months per year

      const servicesCarbon = housingSize * 0.1 * 12 // Rough estimate for services

      const totalCarbon = transportationCarbon + housingCarbon + foodCarbon + goodsCarbon + servicesCarbon

      // Calculate water usage
      const showerWater = 7 * 8 * 52 * WATER_FACTORS.housing.shower // 7 minutes per day, 8 days per week
      const toiletWater = 5 * 7 * 52 * WATER_FACTORS.housing.toilet // 5 flushes per day
      const laundryWater = 3 * 52 * WATER_FACTORS.housing.laundry // 3 loads per week
      const dishWater = 5 * 52 * WATER_FACTORS.housing.dishwasher // 5 loads per week
      const foodWater = (meatConsumption * WATER_FACTORS.food.meat + dairyConsumption * WATER_FACTORS.food.dairy) * 52

      const totalWater = showerWater + toiletWater + laundryWater + dishWater + foodWater

      // Calculate energy consumption
      const heatingEnergy = housingSize * ENERGY_FACTORS.housing.heating * 180 // 180 heating days per year
      const coolingEnergy = housingSize * ENERGY_FACTORS.housing.cooling * 120 // 120 cooling days per year
      const lightingEnergy = housingSize * ENERGY_FACTORS.housing.lighting * 365 // 365 days per year
      const appliancesEnergy = ENERGY_FACTORS.housing.appliances * 365 // 365 days per year
      const waterHeatingEnergy = ENERGY_FACTORS.housing.waterHeating * 365 // 365 days per year

      const totalEnergy = heatingEnergy + coolingEnergy + lightingEnergy + appliancesEnergy + waterHeatingEnergy

      // Calculate waste generation
      const foodWaste = WASTE_FACTORS.food * 365 // 365 days per year
      const packagingWaste = WASTE_FACTORS.packaging * 365 // 365 days per year
      const paperWaste = WASTE_FACTORS.paper * 365 // 365 days per year
      const plasticWaste = WASTE_FACTORS.plastic * 365 // 365 days per year
      const glassWaste = WASTE_FACTORS.glass * 365 // 365 days per year
      const metalWaste = WASTE_FACTORS.metal * 365 // 365 days per year
      const electronicWaste = WASTE_FACTORS.electronic * 365 // 365 days per year

      const totalWaste =
        (foodWaste + packagingWaste + paperWaste + plasticWaste + glassWaste + metalWaste + electronicWaste) *
        (1 - recyclingRate / 100)

      // Set results
      const sustainabilityData: SustainabilityData = {
        carbonFootprint: Number((totalCarbon / 1000).toFixed(2)), // Convert to tons
        waterUsage: Number((totalWater / 1000).toFixed(2)), // Convert to cubic meters
        energyConsumption: Number(totalEnergy.toFixed(2)),
        wasteGeneration: Number(totalWaste.toFixed(2)),
        breakdown: {
          transportation: Number(((transportationCarbon / totalCarbon) * 100).toFixed(1)),
          housing: Number(((housingCarbon / totalCarbon) * 100).toFixed(1)),
          food: Number(((foodCarbon / totalCarbon) * 100).toFixed(1)),
          goods: Number(((goodsCarbon / totalCarbon) * 100).toFixed(1)),
          services: Number(((servicesCarbon / totalCarbon) * 100).toFixed(1)),
        },
      }

      setResults(sustainabilityData)

      // Save data to localStorage
      localStorage.setItem("sustainabilityData", JSON.stringify(sustainabilityData))

      // Switch to results tab
      setActiveTab("results")

      toast({
        title: "Calculation Complete",
        description: "Your sustainability metrics have been calculated successfully.",
      })
    } catch (error) {
      console.error("Error calculating sustainability metrics:", error)
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your sustainability metrics.",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  // Export results as PDF
  const exportToPDF = async () => {
    if (!results || !resultsRef.current) return

    setIsExporting(true)

    try {
      // Dynamically import libraries
      const jsPDF = (await import("jspdf")).default
      const html2canvas = (await import("html2canvas")).default

      const element = resultsRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")

      // Calculate the PDF dimensions based on the element's aspect ratio
      const aspectRatio = canvas.width / canvas.height
      const pdfWidth = 210 // A4 width in mm
      const pdfHeight = pdfWidth / aspectRatio

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      })

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

      // Add footer
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Developed by myHerb.co.il", pdfWidth / 2, pdfHeight - 5, { align: "center" })

      // Save the PDF
      pdf.save("sustainability-report.pdf")

      toast({
        title: "Export Successful",
        description: "Your sustainability report has been exported as a PDF.",
      })
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      toast({
        title: "Export Error",
        description: "There was an error exporting your sustainability report.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Share results via email
  const shareViaEmail = () => {
    if (!results) return

    if (!emailAddress) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create email content
      const subject = "My Sustainability Report"
      const body = `
Hello,

Here's my sustainability report from EcoTrack:

Carbon Footprint: ${results.carbonFootprint} tons CO2e/year
Water Usage: ${results.waterUsage} m³/year
Energy Consumption: ${results.energyConsumption} kWh/year
Waste Generation: ${results.wasteGeneration} kg/year

My sustainability score: ${Math.round(100 - (results.carbonFootprint / 16.2) * 100)}/100

This report was generated using EcoTrack, developed by myHerb.co.il.
      `

      // Create mailto link
      const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      // Open email client
      window.open(mailtoLink, "_blank")

      setIsEmailDialogOpen(false)

      toast({
        title: "Email Prepared",
        description: "Your email client has been opened with the sustainability report.",
      })
    } catch (error) {
      console.error("Error sharing via email:", error)
      toast({
        title: "Sharing Error",
        description: "There was an error preparing the email.",
        variant: "destructive",
      })
    }
  }

  // Print results
  const printResults = () => {
    window.print()
  }

  // Prepare data for charts
  const prepareBreakdownData = () => {
    if (!results) return []

    return [
      { name: "Transportation", value: results.breakdown.transportation },
      { name: "Housing", value: results.breakdown.housing },
      { name: "Food", value: results.breakdown.food },
      { name: "Goods", value: results.breakdown.goods },
      { name: "Services", value: results.breakdown.services },
    ]
  }

  const prepareComparisonData = () => {
    if (!results) return []

    const avgCarbonFootprint = 16.2 // Global average in tons per year
    const avgWaterUsage = 50 // Global average in cubic meters per year
    const avgEnergyConsumption = 3500 // Global average in kWh per year
    const avgWasteGeneration = 500 // Global average in kg per year

    return [
      { name: "Carbon Footprint", you: results.carbonFootprint, average: avgCarbonFootprint, unit: "tons CO2e/year" },
      { name: "Water Usage", you: results.waterUsage, average: avgWaterUsage, unit: "m³/year" },
      { name: "Energy Consumption", you: results.energyConsumption, average: avgEnergyConsumption, unit: "kWh/year" },
      { name: "Waste Generation", you: results.wasteGeneration, average: avgWasteGeneration, unit: "kg/year" },
    ]
  }

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex flex-col gap-6">
            {/* Title and description remain the same... */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Sustainability Tracker</h1>
              <p className="text-muted-foreground">
                Input your lifestyle data to calculate your environmental impact and visualize your sustainability
                metrics.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" ref={tabsRef}>
              {/* Tabs content remains the same... */}
              <TabsList className="w-full max-w-md grid grid-cols-2">
                <TabsTrigger value="input">Input Data</TabsTrigger>
                <TabsTrigger value="results" disabled={!results}>
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transportation</CardTitle>
                    <CardDescription>Enter information about your transportation habits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="transportation-type">Primary Transportation Method</Label>
                      <Select value={transportationType} onValueChange={setTransportationType}>
                        <SelectTrigger id="transportation-type">
                          <SelectValue placeholder="Select transportation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="train">Train</SelectItem>
                          <SelectItem value="plane">Plane</SelectItem>
                          <SelectItem value="bike">Bicycle</SelectItem>
                          <SelectItem value="walk">Walking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="transportation-distance">
                        Average Daily Distance (km): {transportationDistance}
                      </Label>
                      <Slider
                        id="transportation-distance"
                        min={0}
                        max={100}
                        step={1}
                        value={[transportationDistance]}
                        onValueChange={(value) => setTransportationDistance(value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="transportation-frequency">Days Per Week: {transportationFrequency}</Label>
                      <Slider
                        id="transportation-frequency"
                        min={0}
                        max={7}
                        step={1}
                        value={[transportationFrequency]}
                        onValueChange={(value) => setTransportationFrequency(value[0])}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Housing</CardTitle>
                    <CardDescription>Enter information about your home and energy usage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="housing-type">Housing Type</Label>
                      <Select value={housingType} onValueChange={setHousingType}>
                        <SelectTrigger id="housing-type">
                          <SelectValue placeholder="Select housing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="condo">Condominium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="housing-size">Home Size (m²): {housingSize}</Label>
                      <Slider
                        id="housing-size"
                        min={20}
                        max={300}
                        step={5}
                        value={[housingSize]}
                        onValueChange={(value) => setHousingSize(value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="electricity-usage">Monthly Electricity Usage (kWh): {electricityUsage}</Label>
                      <Slider
                        id="electricity-usage"
                        min={50}
                        max={1000}
                        step={10}
                        value={[electricityUsage]}
                        onValueChange={(value) => setElectricityUsage(value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="heating-type">Heating Type</Label>
                      <Select value={heatingType} onValueChange={setHeatingType}>
                        <SelectTrigger id="heating-type">
                          <SelectValue placeholder="Select heating type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="naturalGas">Natural Gas</SelectItem>
                          <SelectItem value="heatingOil">Heating Oil</SelectItem>
                          <SelectItem value="propane">Propane</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="heating-usage">Monthly Heating Usage (kWh equivalent): {heatingUsage}</Label>
                      <Slider
                        id="heating-usage"
                        min={0}
                        max={500}
                        step={10}
                        value={[heatingUsage]}
                        onValueChange={(value) => setHeatingUsage(value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="water-usage">Monthly Water Usage (liters): {waterUsage}</Label>
                      <Slider
                        id="water-usage"
                        min={50}
                        max={500}
                        step={10}
                        value={[waterUsage]}
                        onValueChange={(value) => setWaterUsage(value[0])}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Food</CardTitle>
                    <CardDescription>Enter information about your diet and food consumption</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="diet-type">Diet Type</Label>
                      <Select value={dietType} onValueChange={setDietType}>
                        <SelectTrigger id="diet-type">
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="omnivore">Omnivore</SelectItem>
                          <SelectItem value="pescatarian">Pescatarian</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="meat-consumption">Meat Meals Per Week: {meatConsumption}</Label>
                      <Slider
                        id="meat-consumption"
                        min={0}
                        max={21}
                        step={1}
                        value={[meatConsumption]}
                        onValueChange={(value) => setMeatConsumption(value[0])}
                        disabled={dietType === "vegetarian" || dietType === "vegan"}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="dairy-consumption">Dairy Servings Per Week: {dairyConsumption}</Label>
                      <Slider
                        id="dairy-consumption"
                        min={0}
                        max={21}
                        step={1}
                        value={[dairyConsumption]}
                        onValueChange={(value) => setDairyConsumption(value[0])}
                        disabled={dietType === "vegan"}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="local-food">Local Food Percentage: {localFoodPercentage}%</Label>
                      <Slider
                        id="local-food"
                        min={0}
                        max={100}
                        step={5}
                        value={[localFoodPercentage]}
                        onValueChange={(value) => setLocalFoodPercentage(value[0])}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Consumption & Waste</CardTitle>
                    <CardDescription>
                      Enter information about your purchasing habits and waste management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="clothing-purchases">
                        Clothing Items Purchased Per Month: {clothingPurchases}
                      </Label>
                      <Slider
                        id="clothing-purchases"
                        min={0}
                        max={10}
                        step={0.5}
                        value={[clothingPurchases]}
                        onValueChange={(value) => setClothingPurchases(value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="electronics-purchases">
                        Electronics Purchased Per Month: {electronicsPurchases}
                      </Label>
                      <Slider
                        id="electronics-purchases"
                        min={0}
                        max={5}
                        step={0.1}
                        value={[electronicsPurchases]}
                        onValueChange={(value) => setElectronicsPurchases(value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="household-purchases">
                        Household Items Purchased Per Month: {householdPurchases}
                      </Label>
                      <Slider
                        id="household-purchases"
                        min={0}
                        max={10}
                        step={0.5}
                        value={[householdPurchases]}
                        onValueChange={(value) => setHouseholdPurchases(value[0])}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="recycling-rate">Recycling Rate: {recyclingRate}%</Label>
                      <Slider
                        id="recycling-rate"
                        min={0}
                        max={100}
                        step={5}
                        value={[recyclingRate]}
                        onValueChange={(value) => setRecyclingRate(value[0])}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                  onClick={calculateSustainability}
                  disabled={isCalculating}
                >
                  {isCalculating ? "Calculating..." : "Calculate Sustainability Metrics"}
                </Button>
              </TabsContent>

              <TabsContent value="results" className="space-y-6 pt-4">
                {results && (
                  <div ref={resultsRef}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Your Sustainability Results</h2>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
                            <Download className="h-4 w-4 mr-2" />
                            <span>{isExporting ? "Exporting..." : "Export as PDF"}</span>
                          </DropdownMenuItem>
                          {/* Fix: Replace DialogTrigger with regular DropdownMenuItem */}
                          <DropdownMenuItem onClick={() => setIsEmailDialogOpen(true)}>
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Share via Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={printResults}>
                            <Printer className="h-4 w-4 mr-2" />
                            <span>Print Results</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                          <Leaf className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{results.carbonFootprint} tons CO2e/year</div>
                          <p className="text-xs text-muted-foreground">
                            {results.carbonFootprint < 10 ? "Better than average" : "Above average"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                          <Droplets className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{results.waterUsage} m³/year</div>
                          <p className="text-xs text-muted-foreground">
                            {results.waterUsage < 40 ? "Better than average" : "Above average"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Energy Consumption</CardTitle>
                          <Zap className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{results.energyConsumption} kWh/year</div>
                          <p className="text-xs text-muted-foreground">
                            {results.energyConsumption < 3000 ? "Better than average" : "Above average"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Waste Generation</CardTitle>
                          <Trash2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{results.wasteGeneration} kg/year</div>
                          <p className="text-xs text-muted-foreground">
                            {results.wasteGeneration < 400 ? "Better than average" : "Above average"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Carbon Footprint Breakdown</CardTitle>
                          <CardDescription>Your carbon emissions by category</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={prepareBreakdownData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {prepareBreakdownData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Comparison to Average</CardTitle>
                          <CardDescription>How your impact compares to the average person</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={prepareComparisonData()}
                              layout="vertical"
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" width={100} />
                              <Tooltip
                                formatter={(value, name) => {
                                  const data = prepareComparisonData().find(
                                    (d) => d.you === value || d.average === value,
                                  )
                                  return [`${value} ${data?.unit}`, name === "you" ? "Your Impact" : "Average Impact"]
                                }}
                              />
                              <Legend />
                              <Bar dataKey="you" name="Your Impact" fill="#10b981" />
                              <Bar dataKey="average" name="Average Impact" fill="#6b7280" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Sustainability Score</CardTitle>
                        <CardDescription>Your overall environmental impact score</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-5xl font-bold text-emerald-600">
                              {Math.round(100 - (results.carbonFootprint / 16.2) * 100)}
                            </div>
                            <p className="text-muted-foreground">out of 100</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Carbon Footprint</span>
                              <span>{Math.round(100 - (results.carbonFootprint / 16.2) * 100)}%</span>
                            </div>
                            <Progress value={100 - (results.carbonFootprint / 16.2) * 100} className="h-2" />

                            <div className="flex justify-between text-sm">
                              <span>Water Usage</span>
                              <span>{Math.round(100 - (results.waterUsage / 50) * 100)}%</span>
                            </div>
                            <Progress value={100 - (results.waterUsage / 50) * 100} className="h-2" />

                            <div className="flex justify-between text-sm">
                              <span>Energy Consumption</span>
                              <span>{Math.round(100 - (results.energyConsumption / 3500) * 100)}%</span>
                            </div>
                            <Progress value={100 - (results.energyConsumption / 3500) * 100} className="h-2" />

                            <div className="flex justify-between text-sm">
                              <span>Waste Generation</span>
                              <span>{Math.round(100 - (results.wasteGeneration / 500) * 100)}%</span>
                            </div>
                            <Progress value={100 - (results.wasteGeneration / 500) * 100} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-2">
                        <Button className="w-full" variant="outline" onClick={exportToPDF} disabled={isExporting}>
                          <Download className="h-4 w-4 mr-2" />
                          {isExporting ? "Exporting..." : "Export as PDF"}
                        </Button>
                        <Button className="w-full" variant="outline" onClick={() => setIsEmailDialogOpen(true)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Share via Email
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                        <CardDescription>Personalized suggestions to improve your sustainability</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results.breakdown.transportation > 30 && (
                            <div className="flex gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Car className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Reduce Transportation Emissions</p>
                                <p className="text-xs text-muted-foreground">
                                  Consider carpooling, public transportation, or switching to a more fuel-efficient
                                  vehicle.
                                </p>
                              </div>
                            </div>
                          )}

                          {results.breakdown.housing > 30 && (
                            <div className="flex gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Home className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Improve Home Energy Efficiency</p>
                                <p className="text-xs text-muted-foreground">
                                  Switch to LED bulbs, improve insulation, and consider renewable energy sources.
                                </p>
                              </div>
                            </div>
                          )}

                          {results.breakdown.food > 20 && (
                            <div className="flex gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Utensils className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Adjust Your Diet</p>
                                <p className="text-xs text-muted-foreground">
                                  Reduce meat consumption and increase locally sourced foods in your diet.
                                </p>
                              </div>
                            </div>
                          )}

                          {results.breakdown.goods > 15 && (
                            <div className="flex gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <ShoppingBag className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Reduce Consumption</p>
                                <p className="text-xs text-muted-foreground">
                                  Practice mindful shopping, buy second-hand items, and repair instead of replace.
                                </p>
                              </div>
                            </div>
                          )}

                          {recyclingRate < 50 && (
                            <div className="flex gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Trash2 className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Improve Recycling Habits</p>
                                <p className="text-xs text-muted-foreground">
                                  Increase your recycling rate and learn about proper waste sorting in your area.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialog is now properly separated from the dropdown */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share via Email</DialogTitle>
            <DialogDescription>
              Enter the email address where you'd like to send your sustainability report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="col-span-3"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={shareViaEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Home, ShoppingBag, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { logActivity, type ActivityData } from "@/app/actions/carbon-footprint"

export function ActivityForm() {
  const [activityType, setActivityType] = useState("transportation")
  const [transportType, setTransportType] = useState("car")
  const [energyType, setEnergyType] = useState("electricity")
  const [foodType, setFoodType] = useState("meat")
  const [itemType, setItemType] = useState("clothing")
  const [distance, setDistance] = useState("")
  const [amount, setAmount] = useState("")
  const [servings, setServings] = useState("")
  const [quantity, setQuantity] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { user, isGuest } = useAuth()

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      let value = 0
      let details = {}

      switch (activityType) {
        case "transportation":
          value = Number.parseFloat(distance) || 0
          details = { type: transportType }
          break
        case "home":
          value = Number.parseFloat(amount) || 0
          details = { type: energyType }
          break
        case "food":
          value = Number.parseFloat(servings) || 0
          details = { type: foodType }
          break
        case "consumption":
          value = Number.parseFloat(quantity) || 0
          details = { type: itemType }
          break
      }

      if (value <= 0) {
        toast({
          title: "Invalid value",
          description: "Please enter a valid number greater than zero",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const activityData: ActivityData = {
        type: activityType as any,
        value,
        date,
        details,
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
          title: "Activity logged",
          description: "Your activity has been saved locally. Sign up to sync your data!",
        })
      } else {
        // Use server action for authenticated users
        const result = await logActivity(user?.id || null, activityData)

        if (result.success) {
          toast({
            title: "Activity logged",
            description: result.message || "Your activity has been logged successfully",
          })
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to log activity",
            variant: "destructive",
          })
        }
      }

      // Reset form
      setDistance("")
      setAmount("")
      setServings("")
      setQuantity("")
    } catch (error) {
      console.error("Error logging activity:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Activity</CardTitle>
        <CardDescription>Record your daily activities to track your carbon footprint</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activityType} onValueChange={setActivityType} className="w-full">
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
              <span className="text-xs">Shopping</span>
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
                <Label htmlFor="distance">Distance (miles)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="Enter distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transport-date">Date</Label>
                <Input id="transport-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="home" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="energy-type">Energy Type</Label>
                <Select value={energyType} onValueChange={setEnergyType}>
                  <SelectTrigger id="energy-type">
                    <SelectValue placeholder="Select energy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="natural-gas">Natural Gas</SelectItem>
                    <SelectItem value="heating-oil">Heating Oil</SelectItem>
                    <SelectItem value="propane">Propane</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (kWh)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="home-date">Date</Label>
                <Input id="home-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="food" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="food-type">Food Type</Label>
                <Select value={foodType} onValueChange={setFoodType}>
                  <SelectTrigger id="food-type">
                    <SelectValue placeholder="Select food type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meat">Meat</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="processed">Processed Foods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  placeholder="Enter number of servings"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="food-date">Date</Label>
                <Input id="food-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="consumption" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="item-type">Item Type</Label>
                <Select value={itemType} onValueChange={setItemType}>
                  <SelectTrigger id="item-type">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="household">Household Items</SelectItem>
                    <SelectItem value="personal-care">Personal Care</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="consumption-date">Date</Label>
                <Input id="consumption-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Logging..." : "Log Activity"}
        </Button>
      </CardFooter>
    </Card>
  )
}

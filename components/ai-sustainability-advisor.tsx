"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Leaf, Home, Car, ShoppingBag, Utensils } from "lucide-react"

export default function AISustainabilityAdvisor() {
  const [activeTab, setActiveTab] = useState("home");
  const [formData, setFormData] = useState({
    homeEnergy: 50,
    transportation: 50,
    diet: 50,
    shopping: 50,
    homeType: "apartment",
    carType: "gasoline",
    dietType: "omnivore",
    flightsPerYear: "0-1"
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0]
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const generateResults = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Calculate carbon footprint based on form data
      const homeScore = calculateHomeScore();
      const transportScore = calculateTransportScore();
      const dietScore = calculateDietScore();
      const shoppingScore = calculateShoppingScore();
      
      const totalScore = homeScore + transportScore + dietScore + shoppingScore;
      
      // Generate personalized recommendations
      const recommendations = generateRecommendations();
      
      setResults({
        totalScore,
        breakdown: {
          home: homeScore,
          transport: transportScore,
          diet: dietScore,
          shopping: shoppingScore
        },
        averages: {
          home: 2.5,
          transport: 4.2,
          diet: 3.1,
          shopping: 2.8
        },
        recommendations
      });
      
      setLoading(false);
    }, 1500);
  };

  const calculateHomeScore = () => {
    let score = formData.homeEnergy / 20; // Base score from slider
    
    // Adjust based on home type
    if (formData.homeType === "house") score += 1;
    else if (formData.homeType === "apartment") score += 0.5;
    
    return Number.parseFloat(score.toFixed(1));
  };

  const calculateTransportScore = () => {
    let score = formData.transportation / 20; // Base score from slider
    
    // Adjust based on car type
    if (formData.carType === "electric") score -= 0.8;
    else if (formData.carType === "hybrid") score -= 0.4;
    else if (formData.carType === "gasoline") score += 0.5;
    
    // Adjust based on flights
    if (formData.flightsPerYear === "5+") score += 2;
    else if (formData.flightsPerYear === "2-4") score += 1;
    
    return Number.parseFloat(score.toFixed(1));
  };

  const calculateDietScore = () => {
    let score = formData.diet / 20; // Base score from slider
    
    // Adjust based on diet type
    if (formData.dietType === "vegan") score -= 1;
    else if (formData.dietType === "vegetarian") score -= 0.5;
    else if (formData.dietType === "omnivore") score += 0.5;
    
    return Number.parseFloat(score.toFixed(1));
  };

  const calculateShoppingScore = () => {
    const score = formData.shopping / 20; // Base score from slider
    return Number.parseFloat(score.toFixed(1));
  };

  const generateRecommendations = () => {
    const recommendations = [];
    
    // Home recommendations
    if (formData.homeEnergy > 70) {
      recommendations.push({
        category: "home",
        title: "Reduce Standby Power",
        description: "Unplug electronics when not in use or use smart power strips to cut standby power consumption.",
        impact: "high",
        savings: "Up to 10% on electricity bill"
      });
    }
    
    if (formData.homeType === "house") {
      recommendations.push({
        category: "home",
        title: "Improve Home Insulation",
        description: "Adding proper insulation can significantly reduce heating and cooling needs.",
        impact: "high",
        savings: "Up to 20% on heating/cooling costs"
      });
    }
    
    // Transportation recommendations
    if (formData.carType === "gasoline" && formData.transportation > 60) {
      recommendations.push({
        category: "transport",
        title: "Consider Carpooling",
        description: "Share rides with colleagues or neighbors to reduce emissions and save on fuel costs.",
        impact: "medium",
        savings: "Up to 50% on commuting costs"
      });
    }
    
    if (formData.flightsPerYear === "5+") {
      recommendations.push({
        category: "transport",
        title: "Offset Flight Emissions",
        description: "Consider purchasing carbon offsets for your flights to mitigate their environmental impact.",
        impact: "medium",
        savings: "Carbon neutral travel"
      });
    }
    
    // Diet recommendations
    if (formData.dietType === "omnivore") {
      recommendations.push({
        category: "diet",
        title: "Meatless Mondays",
        description: "Start with one day a week of plant-based meals to reduce your carbon footprint.",
        impact: "medium",
        savings: "Up to 8% reduction in food-related emissions"
      });
    }
    
    // Shopping recommendations
    if (formData.shopping > 60) {
      recommendations.push({
        category: "shopping",
        title: "Buy Second-hand",
        description: "Consider second-hand items before buying new to reduce resource consumption.",
        impact: "medium",
        savings: "Varies by item"
      });
    }
    
    return recommendations;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "transport":
        return <Car className="h-4 w-4" />;
      case "diet":
        return <Utensils className="h-4 w-4" />;
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
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
                <Select 
                  value={formData.homeType} 
                  onValueChange={(value) => handleSelectChange("homeType", value)}
                >
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
                  <span className="text-sm text-muted-foreground">
                    {formData.homeEnergy}%
                  </span>
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
                <Select 
                  value={formData.carType} 
                  onValueChange={(value) => handleSelectChange("carType", value)}
                >
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
                  <span className="text-sm text-muted-foreground">
                    {formData.transportation}%
                  </span>
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
                <Select 
                  value={formData.dietType} 
                  onValueChange={(value) => handleSelectChange("dietType", value)}
                >
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
                  <span className="text-sm text-muted-foreground">
                    {formData.diet}%
                  </span>
                </div>
                <Slider
                  value={[formData.diet]}
                  min={0}
                  max={100}

\

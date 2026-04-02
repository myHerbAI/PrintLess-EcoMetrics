"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Leaf, Droplets, Zap, Trash2, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isGuest } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data - in a real app, this would come from an API or database
  const userData = {
    carbonFootprint: 8.2, // tons CO2e/year
    waterUsage: 32.5, // cubic meters/year
    energyConsumption: 2800, // kWh/year
    wasteGeneration: 320, // kg/year
    challengesCompleted: 5,
    challengesInProgress: 2,
    tipsSaved: 12,
    sustainabilityScore: 72,
  }

  return (
    <div className="bg-muted/40 min-h-screen">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back{user ? `, ${user.email}` : ""}! Here's an overview of your sustainability metrics.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                  <Leaf className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.carbonFootprint} tons CO2e/year</div>
                  <p className="text-xs text-muted-foreground">
                    {userData.carbonFootprint < 10 ? "Better than average" : "Above average"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                  <Droplets className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.waterUsage} m³/year</div>
                  <p className="text-xs text-muted-foreground">
                    {userData.waterUsage < 40 ? "Better than average" : "Above average"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Energy Consumption</CardTitle>
                  <Zap className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.energyConsumption} kWh/year</div>
                  <p className="text-xs text-muted-foreground">
                    {userData.energyConsumption < 3000 ? "Better than average" : "Above average"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waste Generation</CardTitle>
                  <Trash2 className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.wasteGeneration} kg/year</div>
                  <p className="text-xs text-muted-foreground">
                    {userData.wasteGeneration < 400 ? "Better than average" : "Above average"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="tips">Tips</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sustainability Score</CardTitle>
                    <CardDescription>Your overall environmental impact score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold text-emerald-600">{userData.sustainabilityScore}</div>
                        <p className="text-muted-foreground">out of 100</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Carbon Footprint</span>
                          <span>{Math.round(100 - (userData.carbonFootprint / 16.2) * 100)}%</span>
                        </div>
                        <Progress value={100 - (userData.carbonFootprint / 16.2) * 100} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Water Usage</span>
                          <span>{Math.round(100 - (userData.waterUsage / 50) * 100)}%</span>
                        </div>
                        <Progress value={100 - (userData.waterUsage / 50) * 100} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Energy Consumption</span>
                          <span>{Math.round(100 - (userData.energyConsumption / 3500) * 100)}%</span>
                        </div>
                        <Progress value={100 - (userData.energyConsumption / 3500) * 100} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Waste Generation</span>
                          <span>{Math.round(100 - (userData.wasteGeneration / 500) * 100)}%</span>
                        </div>
                        <Progress value={100 - (userData.wasteGeneration / 500) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/sustainability-tracker" className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent sustainability actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Leaf className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Completed Carbon Footprint Assessment</p>
                            <p className="text-xs text-muted-foreground">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Zap className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Reduced Energy Consumption by 15%</p>
                            <p className="text-xs text-muted-foreground">1 week ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Droplets className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Saved 500 Liters of Water</p>
                            <p className="text-xs text-muted-foreground">2 weeks ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Take action to improve your sustainability</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Link href="/sustainability-tracker">
                          <Button className="w-full justify-start" variant="outline">
                            <Leaf className="mr-2 h-4 w-4" />
                            Calculate Your Carbon Footprint
                          </Button>
                        </Link>
                        <Link href="/challenges">
                          <Button className="w-full justify-start" variant="outline">
                            <Zap className="mr-2 h-4 w-4" />
                            Join a Sustainability Challenge
                          </Button>
                        </Link>
                        <Link href="/tips">
                          <Button className="w-full justify-start" variant="outline">
                            <Droplets className="mr-2 h-4 w-4" />
                            Explore Eco-Friendly Tips
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Challenges</CardTitle>
                    <CardDescription>Track your progress on sustainability challenges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">In Progress ({userData.challengesInProgress})</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Plastic-Free Week</p>
                              <p className="text-xs text-muted-foreground">5 days remaining</p>
                            </div>
                            <Progress value={30} className="h-2 w-24" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Meatless Monday</p>
                              <p className="text-xs text-muted-foreground">Ongoing</p>
                            </div>
                            <Progress value={75} className="h-2 w-24" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Completed ({userData.challengesCompleted})</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Energy Saving Challenge</p>
                              <p className="text-xs text-muted-foreground">Completed 2 weeks ago</p>
                            </div>
                            <Progress value={100} className="h-2 w-24" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Water Conservation</p>
                              <p className="text-xs text-muted-foreground">Completed 1 month ago</p>
                            </div>
                            <Progress value={100} className="h-2 w-24" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/challenges" className="w-full">
                      <Button variant="outline" className="w-full">
                        View All Challenges
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="tips" className="space-y-6 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Tips</CardTitle>
                    <CardDescription>Your collection of eco-friendly tips</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Leaf className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Use Reusable Bags</p>
                          <p className="text-xs text-muted-foreground">Waste Reduction</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Install LED Bulbs</p>
                          <p className="text-xs text-muted-foreground">Energy</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Droplets className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Reduce Water Usage</p>
                          <p className="text-xs text-muted-foreground">Water</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/tips" className="w-full">
                      <Button variant="outline" className="w-full">
                        View All Tips
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

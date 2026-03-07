"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Calendar, Check, Clock, Users } from "lucide-react"
import Header from "@/components/header" // Updated import
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

// Mock challenge data - in a real app, this would come from an API or database
const challengesData = {
  "meatless-monday": {
    title: "Meatless Monday",
    description: "Skip meat for a day and reduce your carbon footprint.",
    longDescription:
      "Meatless Monday is a global movement that encourages people to reduce meat consumption for their health and the health of the planet. By skipping meat just one day per week, you can significantly reduce your carbon footprint and help combat climate change.",
    participants: 243,
    daysLeft: 3,
    difficulty: "Easy",
    category: "Food",
    steps: [
      "Plan your meatless meals for Monday",
      "Try plant-based protein sources like beans, lentils, or tofu",
      "Share your experience on social media with #MeatlessMonday",
      "Calculate how much carbon you saved by skipping meat",
    ],
    impact: "Skipping meat one day per week can reduce your carbon footprint by up to 8 pounds of CO2 emissions.",
  },
  "zero-waste-week": {
    title: "Zero Waste Week",
    description: "Minimize your waste production for an entire week.",
    longDescription:
      "Zero Waste Week challenges you to reduce the amount of waste you send to landfill. By being mindful of packaging, composting food scraps, and reusing items, you can significantly decrease your environmental impact.",
    participants: 187,
    daysLeft: 5,
    difficulty: "Medium",
    category: "Waste",
    steps: [
      "Audit your current waste production",
      "Shop with reusable bags and containers",
      "Compost food scraps",
      "Avoid single-use items",
      "Track your waste reduction progress",
    ],
    impact:
      "The average person produces 4.5 pounds of waste per day. By participating in Zero Waste Week, you could prevent up to 31.5 pounds of waste from entering landfills.",
  },
  "bike-to-work": {
    title: "Bike to Work",
    description: "Leave your car at home and cycle to work for a week.",
    longDescription:
      "The Bike to Work challenge encourages you to commute by bicycle instead of driving. This reduces carbon emissions, improves air quality, and provides health benefits through exercise.",
    participants: 156,
    daysLeft: 7,
    difficulty: "Medium",
    category: "Transportation",
    steps: [
      "Plan your cycling route to work",
      "Prepare your bicycle and safety equipment",
      "Track your mileage each day",
      "Calculate your carbon savings compared to driving",
    ],
    impact:
      "A 10-mile round trip commute by bicycle instead of car saves about 5 pounds of carbon dioxide emissions per day.",
  },
  "energy-saver": {
    title: "Energy Saver",
    description: "Reduce your home energy consumption by 20% this month.",
    longDescription:
      "The Energy Saver challenge helps you identify and reduce energy waste in your home. By making simple changes to your habits and home setup, you can lower your energy bills and reduce your carbon footprint.",
    participants: 132,
    daysLeft: 12,
    difficulty: "Medium",
    category: "Energy",
    steps: [
      "Record your current energy usage as a baseline",
      "Identify energy-wasting habits and appliances",
      "Implement energy-saving measures like LED bulbs and smart power strips",
      "Monitor and record your reduced energy consumption",
    ],
    impact:
      "Reducing your home energy use by 20% could save approximately 200-400 pounds of CO2 emissions per month for the average household.",
  },
  "plastic-free-shopping": {
    title: "Plastic-Free Shopping",
    description: "Avoid all single-use plastic when shopping for groceries.",
    longDescription:
      "The Plastic-Free Shopping challenge encourages you to eliminate single-use plastic from your shopping routine. By bringing reusable bags, containers, and choosing products with minimal packaging, you can significantly reduce plastic waste.",
    participants: 98,
    daysLeft: 4,
    difficulty: "Hard",
    category: "Waste",
    steps: [
      "Prepare reusable shopping bags, produce bags, and containers",
      "Shop at farmers markets, bulk stores, or zero-waste shops when possible",
      "Choose products with plastic-free packaging",
      "Track how much plastic you've avoided",
    ],
    impact:
      "The average person uses about 156 plastic bags per year. By shopping plastic-free, you could prevent hundreds of pieces of plastic from entering the waste stream.",
  },
  "local-food-challenge": {
    title: "Local Food Challenge",
    description: "Only eat food produced within 100 miles of your home.",
    longDescription:
      "The Local Food Challenge encourages you to source your food from local producers. This reduces the carbon footprint associated with food transportation and supports local farmers and businesses.",
    participants: 76,
    daysLeft: 9,
    difficulty: "Hard",
    category: "Food",
    steps: [
      "Research local farmers, markets, and food producers in your area",
      "Plan meals using seasonally available local ingredients",
      "Track the origin of all food you consume",
      "Calculate the reduced food miles compared to your regular diet",
    ],
    impact:
      "Food in the U.S. travels an average of 1,500 miles from farm to plate. Eating locally can reduce this distance by over 90%, significantly cutting transportation emissions.",
  },
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  const { id } = params
  const challenge = challengesData[id as keyof typeof challengesData]
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isGuest } = useAuth()

  if (!challenge) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header activeLink="challenges" />
        <main className="flex-1 bg-muted/40 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Challenge Not Found</CardTitle>
              <CardDescription>The challenge you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/challenges")} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Back to Challenges
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  const handleJoinChallenge = () => {
    setIsJoining(true)

    // Simulate API call
    setTimeout(() => {
      setHasJoined(true)
      setIsJoining(false)

      if (isGuest) {
        // Store in localStorage for guest users
        const joinedChallenges = JSON.parse(localStorage.getItem("guestChallenges") || "[]")
        joinedChallenges.push({
          id,
          joinedAt: new Date().toISOString(),
          progress: 0,
        })
        localStorage.setItem("guestChallenges", JSON.stringify(joinedChallenges))
      }

      toast({
        title: "Challenge Joined",
        description: `You've successfully joined the ${challenge.title} challenge!`,
      })
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeLink="challenges" />
      <main className="flex-1 bg-muted/40">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push("/challenges")}>
                  Back to Challenges
                </Button>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {challenge.category}
                </Badge>
                <Badge
                  variant={
                    challenge.difficulty === "Easy"
                      ? "default"
                      : challenge.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                  className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800"
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
              <p className="text-muted-foreground">{challenge.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Challenge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{challenge.longDescription}</p>
                    <div className="mt-6 space-y-4">
                      <h3 className="font-medium text-lg">Challenge Steps</h3>
                      <ul className="space-y-2">
                        {challenge.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-medium text-lg mb-2">Environmental Impact</h3>
                      <p className="text-muted-foreground">{challenge.impact}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Progress</CardTitle>
                    <CardDescription>Track your progress throughout the challenge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasJoined ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <Tabs defaultValue="tasks">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                            <TabsTrigger value="log">Activity Log</TabsTrigger>
                          </TabsList>
                          <TabsContent value="tasks" className="space-y-4 pt-4">
                            <div className="space-y-2">
                              {challenge.steps.map((step, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`step-${index}`}
                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <label htmlFor={`step-${index}`} className="text-sm">
                                    {step}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="log" className="pt-4">
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">No activity logged yet</p>
                              <Button variant="outline" className="mt-4">
                                Log Activity
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Join This Challenge</h3>
                        <p className="text-muted-foreground mb-4">
                          Join this challenge to track your progress and make a positive impact.
                        </p>
                        <Button
                          onClick={handleJoinChallenge}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={isJoining}
                        >
                          {isJoining ? "Joining..." : "Join Challenge"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="font-medium">Participants</p>
                          <p className="text-sm text-muted-foreground">{challenge.participants} people joined</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="font-medium">Time Remaining</p>
                          <p className="text-sm text-muted-foreground">{challenge.daysLeft} days left</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">7 days</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Leaderboard</CardTitle>
                    <CardDescription>Top participants in this challenge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Alex Johnson", progress: 85, rank: 1 },
                        { name: "Maria Garcia", progress: 72, rank: 2 },
                        { name: "Sam Taylor", progress: 68, rank: 3 },
                      ].map((user) => (
                        <div key={user.rank} className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            {user.rank}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm">{user.progress}%</p>
                            </div>
                            <Progress value={user.progress} className="h-2 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Full Leaderboard
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

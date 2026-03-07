import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Clock, Filter, Search, Users } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header" // Updated import

export default function ChallengesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header activeLink="challenges" />
      <main className="flex-1 bg-muted/40">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Sustainability Challenges</h1>
              <p className="text-muted-foreground">
                Join challenges to build eco-friendly habits and make a positive impact on the environment.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="search" placeholder="Search challenges..." className="h-9" />
                <Button type="submit" size="sm" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </Button>
              </div>
            </div>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4 pt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Meatless Monday",
                      description: "Skip meat for a day and reduce your carbon footprint.",
                      participants: 243,
                      daysLeft: 3,
                      difficulty: "Easy",
                      category: "Food",
                      id: "meatless-monday",
                    },
                    {
                      title: "Zero Waste Week",
                      description: "Minimize your waste production for an entire week.",
                      participants: 187,
                      daysLeft: 5,
                      difficulty: "Medium",
                      category: "Waste",
                      id: "zero-waste-week",
                    },
                    {
                      title: "Bike to Work",
                      description: "Leave your car at home and cycle to work for a week.",
                      participants: 156,
                      daysLeft: 7,
                      difficulty: "Medium",
                      category: "Transportation",
                      id: "bike-to-work",
                    },
                    {
                      title: "Energy Saver",
                      description: "Reduce your home energy consumption by 20% this month.",
                      participants: 132,
                      daysLeft: 12,
                      difficulty: "Medium",
                      category: "Energy",
                      id: "energy-saver",
                    },
                    {
                      title: "Plastic-Free Shopping",
                      description: "Avoid all single-use plastic when shopping for groceries.",
                      participants: 98,
                      daysLeft: 4,
                      difficulty: "Hard",
                      category: "Waste",
                      id: "plastic-free-shopping",
                    },
                    {
                      title: "Local Food Challenge",
                      description: "Only eat food produced within 100 miles of your home.",
                      participants: 76,
                      daysLeft: 9,
                      difficulty: "Hard",
                      category: "Food",
                      id: "local-food-challenge",
                    },
                  ].map((challenge, index) => (
                    <Card key={index} className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
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
                        <CardTitle className="mt-2">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{challenge.participants} participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{challenge.daysLeft} days left</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/challenges/${challenge.id}`} className="w-full">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Join Challenge</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="upcoming" className="pt-4">
                <div className="rounded-lg border bg-card p-8 text-center">
                  <Award className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">New Challenges Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're preparing exciting new sustainability challenges for you.
                  </p>
                  <Button variant="outline">Get Notified</Button>
                </div>
              </TabsContent>
              <TabsContent value="completed" className="pt-4">
                <div className="rounded-lg border bg-card p-8 text-center">
                  <Award className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Completed Challenges Yet</h3>
                  <p className="text-muted-foreground mb-4">Join and complete challenges to see them here.</p>
                  <Link href="#active">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Browse Challenges</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Calendar, Clock, Award, Leaf, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getSavedTips, getActiveChallenges } from "@/app/actions/tips"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function MyContentPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [savedTips, setSavedTips] = useState<any[]>([])
  const [activeChallenges, setActiveChallenges] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading) {
        if (user) {
          try {
            const tips = await getSavedTips(user.id)
            const challenges = await getActiveChallenges(user.id)
            setSavedTips(tips || [])
            setActiveChallenges(challenges || [])
          } catch (error) {
            console.error("Error fetching saved content:", error)
          }
        }
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Saved Content</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="mb-6">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to view your saved content.
            <div className="mt-4">
              <Button onClick={() => router.push("/signin")}>Sign In</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Saved Content</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="tips">Saved Tips</TabsTrigger>
          <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {savedTips.length === 0 && activeChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No saved content yet</h3>
                  <p className="text-gray-500 mb-6">Start saving tips and joining challenges to see them here</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => router.push("/tips")}>
                      Browse Tips
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/challenges")}>
                      Explore Challenges
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {savedTips.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <Bookmark className="mr-2 h-5 w-5" />
                        Saved Tips
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedTips.map((tip) => (
                          <Card key={tip.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{tip.title}</CardTitle>
                                <Badge variant="outline" className="bg-green-50">
                                  {tip.category || "General"}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center text-sm">
                                <Leaf className="h-3 w-3 mr-1" />
                                {tip.impact_level || "Medium"} Impact
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="line-clamp-3 text-sm">{tip.description}</p>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/tips/${tip.id}`}>Read More</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeChallenges.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <Award className="mr-2 h-5 w-5" />
                        Active Challenges
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeChallenges.map((challenge) => (
                          <Card key={challenge.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                                <Badge variant="outline" className="bg-blue-50">
                                  {challenge.difficulty || "Medium"}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center text-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {challenge.duration || "7"} days
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="line-clamp-3 text-sm">{challenge.description}</p>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/challenges/${challenge.id}`}>View Challenge</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="tips">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {savedTips.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No saved tips yet</h3>
                  <p className="text-gray-500 mb-6">Browse our tips collection and save the ones you find useful</p>
                  <Button onClick={() => router.push("/tips")}>
                    Browse Tips
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedTips.map((tip) => (
                    <Card key={tip.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                          <Badge variant="outline" className="bg-green-50">
                            {tip.category || "General"}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center text-sm">
                          <Leaf className="h-3 w-3 mr-1" />
                          {tip.impact_level || "Medium"} Impact
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3 text-sm">{tip.description}</p>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/tips/${tip.id}`}>Read More</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="challenges">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {activeChallenges.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No active challenges</h3>
                  <p className="text-gray-500 mb-6">Join challenges to track your progress and make a bigger impact</p>
                  <Button onClick={() => router.push("/challenges")}>
                    Explore Challenges
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeChallenges.map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <Badge variant="outline" className="bg-blue-50">
                            {challenge.difficulty || "Medium"}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {challenge.duration || "7"} days
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {challenge.progress || "0"}% complete
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3 text-sm">{challenge.description}</p>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/challenges/${challenge.id}`}>View Challenge</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

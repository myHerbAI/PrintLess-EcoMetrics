import type { Metadata } from "next"
import Link from "next/link"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, MessageSquare, Heart, ThumbsUp, Search, Filter, TrendingUp, Clock, UserPlus, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "Community | EcoWise",
  description: "Connect with like-minded individuals and share your sustainability journey.",
}

export default function CommunityPage() {
  return (
    <LayoutWithSidebar>
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">
              Connect with like-minded individuals and share your sustainability journey.
            </p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="search" placeholder="Search community..." className="h-9" />
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
              <Link href="/community/new-post">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Create Post</Button>
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            {/* Posts feed */}
            <div className="space-y-6">
              <Tabs defaultValue="trending" className="w-full">
                <TabsList className="w-full max-w-md grid grid-cols-3">
                  <TabsTrigger value="trending" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending</span>
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Recent</span>
                  </TabsTrigger>
                  <TabsTrigger value="following" className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    <span>Following</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="space-y-4 pt-4">
                  {[
                    {
                      author: "Alex Johnson",
                      avatar: "AJ",
                      avatarUrl: "",
                      title: "My Zero Waste Journey: Month 1 Results",
                      content:
                        "I've been on a zero waste journey for a month now, and I wanted to share my progress. I've reduced my waste by 70% by making simple changes like using reusable bags, containers, and water bottles.",
                      likes: 42,
                      comments: 12,
                      time: "2 hours ago",
                      tags: ["Zero Waste", "Lifestyle"],
                    },
                    {
                      author: "Maria Garcia",
                      avatar: "MG",
                      avatarUrl: "",
                      title: "DIY Solar Panel Installation: Lessons Learned",
                      content:
                        "After months of research, I finally installed solar panels on my roof. Here's what I learned about the process, costs, and benefits. Feel free to ask questions if you're considering going solar!",
                      likes: 38,
                      comments: 24,
                      time: "5 hours ago",
                      tags: ["Renewable Energy", "DIY"],
                    },
                    {
                      author: "Sam Taylor",
                      avatar: "ST",
                      avatarUrl: "",
                      title: "Community Garden Project Success",
                      content:
                        "Our neighborhood community garden project is thriving! We've grown over 200 pounds of organic vegetables this season and donated half to the local food bank. Here are some photos of our harvest.",
                      likes: 29,
                      comments: 8,
                      time: "1 day ago",
                      tags: ["Gardening", "Community"],
                    },
                  ].map((post, index) => (
                    <Card key={index} className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            {post.avatarUrl ? (
                              <AvatarImage src={post.avatarUrl || "/placeholder.svg"} alt={post.author} />
                            ) : (
                              <AvatarFallback>{post.avatar}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{post.author}</div>
                            <div className="text-xs text-muted-foreground">{post.time}</div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-4">
                          <Link href={`/community/post/${index}`} className="hover:text-emerald-600">
                            {post.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{post.content}</p>
                        <div className="flex gap-2 mt-4">
                          {post.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Heart className="h-4 w-4" />
                          <span>Save</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="recent" className="pt-4">
                  <Card className="p-8 text-center">
                    <Users className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Join the Community</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign up to see the latest posts and connect with other eco-conscious individuals.
                    </p>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Sign Up Now</Button>
                  </Card>
                </TabsContent>

                <TabsContent value="following" className="pt-4">
                  <Card className="p-8 text-center">
                    <Users className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Follow Community Members</h3>
                    <p className="text-muted-foreground mb-4">Follow other members to see their posts in your feed.</p>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Explore Members</Button>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Groups</CardTitle>
                  <CardDescription>Join these active community groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Zero Waste Living", members: 1243, icon: "🌱" },
                      { name: "Renewable Energy", members: 876, icon: "⚡" },
                      { name: "Sustainable Gardening", members: 654, icon: "🌿" },
                    ].map((group, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            <span role="img" aria-label={group.name}>
                              {group.icon}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.members} members</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/community/groups" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Groups
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>Top contributors this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Alex Johnson", points: 1250, rank: 1 },
                      { name: "Maria Garcia", points: 1120, rank: 2 },
                      { name: "Sam Taylor", points: 980, rank: 3 },
                      { name: "Jamie Lee", points: 840, rank: 4 },
                      { name: "Chris Wong", points: 720, rank: 5 },
                    ].map((user) => (
                      <div key={user.rank} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          {user.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.points} points</p>
                        </div>
                        <Award
                          className={`h-5 w-5 ${user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-gray-400" : user.rank === 3 ? "text-amber-700" : "text-emerald-500"}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/community/leaderboard" className="w-full">
                    <Button variant="outline" className="w-full">
                      View Full Leaderboard
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Join these community events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Beach Cleanup", date: "May 15, 2023", attendees: 32 },
                      { name: "Sustainable Living Workshop", date: "May 22, 2023", attendees: 18 },
                      { name: "Community Garden Day", date: "June 5, 2023", attendees: 24 },
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date} • {event.attendees} attending
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          RSVP
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/community/events" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Events
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

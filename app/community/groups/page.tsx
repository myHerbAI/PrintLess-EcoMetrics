import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Globe, Lock, MessageSquare } from "lucide-react"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import Link from "next/link"

export default function CommunityGroupsPage() {
  // Sample groups data
  const groups = [
    {
      id: "zero-waste-living",
      name: "Zero Waste Living",
      description: "Tips, tricks, and support for reducing waste in everyday life.",
      members: 1243,
      posts: 324,
      isPrivate: false,
      category: "Lifestyle",
      lastActive: "2 hours ago",
    },
    {
      id: "renewable-energy",
      name: "Renewable Energy Enthusiasts",
      description: "Discussions about solar, wind, and other renewable energy sources.",
      members: 876,
      posts: 215,
      isPrivate: false,
      category: "Energy",
      lastActive: "5 hours ago",
    },
    {
      id: "sustainable-gardening",
      name: "Sustainable Gardening",
      description: "Growing food and plants using eco-friendly methods.",
      members: 932,
      posts: 287,
      isPrivate: false,
      category: "Gardening",
      lastActive: "1 day ago",
    },
    {
      id: "eco-friendly-parenting",
      name: "Eco-Friendly Parenting",
      description: "Raising environmentally conscious children in today's world.",
      members: 654,
      posts: 178,
      isPrivate: false,
      category: "Parenting",
      lastActive: "2 days ago",
    },
    {
      id: "vegan-recipes",
      name: "Vegan Recipe Sharing",
      description: "Share and discover delicious plant-based recipes.",
      members: 1087,
      posts: 412,
      isPrivate: false,
      category: "Food",
      lastActive: "3 hours ago",
    },
    {
      id: "sustainable-fashion",
      name: "Sustainable Fashion",
      description: "Ethical clothing, secondhand shopping, and reducing fashion waste.",
      members: 743,
      posts: 198,
      isPrivate: false,
      category: "Fashion",
      lastActive: "1 day ago",
    },
    {
      id: "climate-action",
      name: "Climate Action Network",
      description: "Organizing and participating in climate activism and advocacy.",
      members: 1532,
      posts: 356,
      isPrivate: true,
      category: "Activism",
      lastActive: "6 hours ago",
    },
    {
      id: "green-tech",
      name: "Green Technology",
      description: "Innovations and technologies that help protect the environment.",
      members: 892,
      posts: 231,
      isPrivate: false,
      category: "Technology",
      lastActive: "4 hours ago",
    },
  ]

  return (
    <LayoutWithSidebar>
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Community Groups</h1>
            <p className="text-muted-foreground">
              Join groups of like-minded individuals focused on specific sustainability topics.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="search" placeholder="Search groups..." className="h-9" />
              <Button type="submit" size="sm" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Create Group</Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="all">All Groups</TabsTrigger>
              <TabsTrigger value="my-groups">My Groups</TabsTrigger>
              <TabsTrigger value="suggested">Suggested</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 pt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <Card key={group.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          {group.category}
                        </Badge>
                        {group.isPrivate ? (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{group.posts} posts</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Last active: {group.lastActive}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/community/groups/${group.id}`} className="w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Join Group</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-groups" className="pt-4">
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">You haven't joined any groups yet</h3>
                <p className="text-muted-foreground mb-4">
                  Join groups to connect with others who share your sustainability interests.
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Explore Groups</Button>
              </div>
            </TabsContent>

            <TabsContent value="suggested" className="pt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groups.slice(0, 3).map((group) => (
                  <Card key={group.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          {group.category}
                        </Badge>
                        {group.isPrivate ? (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{group.posts} posts</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Last active: {group.lastActive}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/community/groups/${group.id}`} className="w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Join Group</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

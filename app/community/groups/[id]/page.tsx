"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Heart,
  Calendar,
  Settings,
  UserPlus,
  Send,
  PlusCircle,
  MapPin,
} from "lucide-react"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { useToast } from "@/hooks/use-toast"

// Mock group data
const groupsData = {
  "zero-waste-living": {
    id: "zero-waste-living",
    name: "Zero Waste Living",
    description: "Tips, tricks, and support for reducing waste in everyday life.",
    longDescription:
      "This group is dedicated to sharing practical advice, resources, and support for those looking to reduce their waste footprint. Whether you're just starting your zero waste journey or have been living this lifestyle for years, everyone is welcome to share their experiences and learn from others.",
    members: 1243,
    posts: 324,
    isPrivate: false,
    category: "Lifestyle",
    lastActive: "2 hours ago",
    createdAt: "June 15, 2022",
    admins: [
      { name: "Emma Johnson", avatar: "EJ" },
      { name: "Michael Chen", avatar: "MC" },
    ],
    rules: [
      "Be respectful and supportive of all members",
      "No promotional content without admin approval",
      "Share only accurate information and cite sources when possible",
      "Focus on practical, actionable advice",
    ],
  },
  "renewable-energy": {
    id: "renewable-energy",
    name: "Renewable Energy Enthusiasts",
    description: "Discussions about solar, wind, and other renewable energy sources.",
    longDescription:
      "A community for discussing all aspects of renewable energy, from residential solar installations to large-scale wind farms and emerging technologies. Members share their experiences with renewable energy systems, discuss policy developments, and explore the future of sustainable power generation.",
    members: 876,
    posts: 215,
    isPrivate: false,
    category: "Energy",
    lastActive: "5 hours ago",
    createdAt: "August 3, 2022",
    admins: [
      { name: "David Wilson", avatar: "DW" },
      { name: "Sarah Ahmed", avatar: "SA" },
    ],
    rules: [
      "Focus on factual information about renewable energy",
      "Respect different perspectives on energy solutions",
      "No political discussions unless directly related to energy policy",
      "When sharing products or services, disclose any affiliations",
    ],
  },
}

// Mock posts data
const postsData = [
  {
    id: "post1",
    author: "Emma Johnson",
    avatar: "EJ",
    title: "My Zero Waste Kitchen Transformation",
    content:
      "After six months of gradually replacing single-use items in my kitchen, I'm excited to share my progress! I've eliminated almost all plastic packaging and reduced my kitchen waste by about 80%. Here are some of the switches that made the biggest difference...",
    likes: 42,
    comments: 12,
    time: "2 hours ago",
    tags: ["Kitchen", "Plastic Free"],
  },
  {
    id: "post2",
    author: "Alex Rivera",
    avatar: "AR",
    title: "Bulk Shopping Guide for Beginners",
    content:
      "I remember how intimidating bulk shopping seemed when I first started my zero waste journey. Today I'm sharing my complete guide for beginners, including what containers work best, how to tare weights, and my favorite bulk items to start with...",
    likes: 38,
    comments: 24,
    time: "5 hours ago",
    tags: ["Shopping", "Beginners"],
  },
  {
    id: "post3",
    author: "Taylor Kim",
    avatar: "TK",
    title: "DIY Beeswax Wraps - Easier Than You Think!",
    content:
      "I finally tried making my own beeswax wraps this weekend and I can't believe I waited so long! The process was much simpler than I expected and the results are fantastic. Here's my step-by-step process with photos...",
    likes: 29,
    comments: 8,
    time: "1 day ago",
    tags: ["DIY", "Kitchen"],
  },
]

// Mock events data
const eventsData = [
  {
    id: "event1",
    title: "Community Cleanup Day",
    description: "Join us for our monthly neighborhood cleanup event. Gloves and bags provided!",
    date: "June 15, 2023",
    time: "9:00 AM - 12:00 PM",
    location: "Central Park, Main Entrance",
    attendees: 24,
  },
  {
    id: "event2",
    title: "Zero Waste Workshop: Composting Basics",
    description: "Learn how to start composting at home, even in small spaces.",
    date: "June 22, 2023",
    time: "6:30 PM - 8:00 PM",
    location: "Community Center, Room 103",
    attendees: 18,
  },
]

// Mock members data
const membersData = Array(12)
  .fill(null)
  .map((_, i) => ({
    id: `member${i + 1}`,
    name: [
      "Emma Johnson",
      "Michael Chen",
      "Sarah Ahmed",
      "David Wilson",
      "Alex Rivera",
      "Taylor Kim",
      "Jordan Smith",
      "Casey Wong",
      "Riley Patel",
      "Morgan Lee",
      "Jamie Garcia",
      "Quinn Thomas",
    ][i],
    avatar: ["EJ", "MC", "SA", "DW", "AR", "TK", "JS", "CW", "RP", "ML", "JG", "QT"][i],
    joinDate: "Joined " + ["January", "February", "March", "April", "May", "June"][Math.floor(i / 2)] + " 2023",
    posts: Math.floor(Math.random() * 20) + 1,
  }))

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const group = groupsData[id as keyof typeof groupsData]
  const [activeTab, setActiveTab] = useState("discussions")
  const [commentText, setCommentText] = useState("")
  const [isJoined, setIsJoined] = useState(false)
  const { toast } = useToast()

  if (!group) {
    return (
      <LayoutWithSidebar>
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <Card>
            <CardHeader>
              <CardTitle>Group Not Found</CardTitle>
              <CardDescription>The group you're looking for doesn't exist or has been removed.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </CardFooter>
          </Card>
        </div>
      </LayoutWithSidebar>
    )
  }

  const handleJoinGroup = () => {
    setIsJoined(!isJoined)
    toast({
      title: isJoined ? "Left group" : "Joined group",
      description: isJoined
        ? `You have left the ${group.name} group`
        : `You have successfully joined the ${group.name} group`,
    })
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      })
      setCommentText("")
    }
  }

  return (
    <LayoutWithSidebar>
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col gap-8">
          {/* Group Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                      {group.category}
                    </Badge>
                    {group.isPrivate ? (
                      <Badge variant="secondary">Private Group</Badge>
                    ) : (
                      <Badge variant="outline">Public Group</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">{group.name}</CardTitle>
                  <CardDescription className="mt-2">{group.description}</CardDescription>
                </div>
                <Button
                  onClick={handleJoinGroup}
                  variant={isJoined ? "outline" : "default"}
                  className={isJoined ? "" : "bg-emerald-600 hover:bg-emerald-700"}
                >
                  {isJoined ? "Leave Group" : "Join Group"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{group.members} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{group.posts} posts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {group.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-4">
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            {/* Discussions Tab */}
            <TabsContent value="discussions" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Discussions</h2>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>

              <div className="space-y-4">
                {postsData.map((post) => (
                  <Card key={post.id} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.author}</div>
                          <div className="text-xs text-muted-foreground">{post.time}</div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mt-4">{post.title}</CardTitle>
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
                    <CardFooter className="flex flex-col gap-4">
                      <div className="flex justify-between w-full">
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
                      </div>

                      <form onSubmit={handlePostComment} className="flex w-full gap-2">
                        <Input
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Post comment</span>
                        </Button>
                      </form>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {eventsData.map((event) => (
                  <Card key={event.id} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-600" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">RSVP</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Group Members</h2>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {membersData.map((member) => (
                  <Card key={member.id} className="transition-all hover:shadow-md">
                    <CardHeader className="text-center pb-2">
                      <Avatar className="h-16 w-16 mx-auto">
                        <AvatarFallback className="text-lg">{member.avatar}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="mt-2 text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.joinDate}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">{member.posts} posts</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About This Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{group.longDescription}</p>

                  <h3 className="text-lg font-semibold mb-2">Group Rules</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {group.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Group Admins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {group.admins.map((admin, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>{admin.avatar}</AvatarFallback>
                        </Avatar>
                        <span>{admin.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isJoined && (
                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Group Settings
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

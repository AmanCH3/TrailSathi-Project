"use client"

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, MapPin, Clock, Mountain } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "lucide-react"

const groups = [
  {
    id: 1,
    title: "Sunrise Hike at Mt. Rainier",
    date: "May 15, 2025",
    location: "Mt. Rainier National Park",
    participants: 6,
    maxSize: 8,
    leader: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=100&width=100",
    },
    memberTypes: ["Experienced", "New", "New", "Experienced", "New", "Experienced"],
    trailInfo: {
      difficulty: "Moderate",
      distance: "7.5 km",
      elevation: "650 m",
      duration: "4-5 hours",
    },
    description:
      "Experience the magic of sunrise from the stunning viewpoint at Mt. Rainier. Perfect for photographers and early birds!",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Weekend Trek: Coastal Trail",
    date: "May 22, 2025",
    location: "Pacific Coast Highway",
    participants: 4,
    maxSize: 10,
    leader: {
      name: "Mike Chen",
      image: "/placeholder.svg?height=100&width=100",
    },
    memberTypes: ["Experienced", "Experienced", "New", "New"],
    trailInfo: {
      difficulty: "Easy",
      distance: "6.2 km",
      elevation: "120 m",
      duration: "2-3 hours",
    },
    description:
      "A beautiful coastal hike with stunning ocean views. Great for all skill levels with plenty of photo opportunities.",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Forest Meditation Walk",
    date: "May 28, 2025",
    location: "Redwood Forest",
    participants: 5,
    maxSize: 6,
    leader: {
      name: "Emma Davis",
      image: "/placeholder.svg?height=100&width=100",
    },
    memberTypes: ["Experienced", "New", "New", "Experienced", "New"],
    trailInfo: {
      difficulty: "Easy",
      distance: "3.5 km",
      elevation: "50 m",
      duration: "1.5-2 hours",
    },
    description:
      "Slow-paced walk through ancient redwoods with guided meditation stops. Focus on mindfulness and nature connection.",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Advanced Alpine Trek",
    date: "June 5, 2025",
    location: "Alpine Ridge Mountains",
    participants: 3,
    maxSize: 4,
    leader: {
      name: "Alex Rivera",
      image: "/placeholder.svg?height=100&width=100",
    },
    memberTypes: ["Experienced", "Experienced", "Experienced"],
    trailInfo: {
      difficulty: "Difficult",
      distance: "14.2 km",
      elevation: "1200 m",
      duration: "7-8 hours",
    },
    description:
      "Challenging high-altitude trek for experienced hikers only. Technical sections require proper gear and conditioning.",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Waterfall Photography Hike",
    date: "April 15, 2025",
    location: "Silver Falls State Park",
    participants: 8,
    maxSize: 8,
    leader: {
      name: "Priya Sharma",
      image: "/placeholder.svg?height=100&width=100",
    },
    memberTypes: ["Experienced", "New", "New", "Experienced", "New", "Experienced", "New", "Experienced"],
    trailInfo: {
      difficulty: "Moderate",
      distance: "8.7 km",
      elevation: "320 m",
      duration: "4-5 hours",
    },
    description:
      "Captured the beauty of multiple waterfalls along this loop trail. Perfect conditions after recent rainfall.",
    status: "past",
  },
  {
    id: 6,
    title: "Desert Sunset Expedition",
    date: "March 30, 2025",
    location: "Red Rock Canyon",
    participants: 5,
    maxSize: 6,
    leader: {
      name: "David Lee",
      image: "/placeholder.svg?height=100&width=100",
    },
    memberTypes: ["Experienced", "New", "Experienced", "New", "Experienced"],
    trailInfo: {
      difficulty: "Moderate",
      distance: "5.5 km",
      elevation: "280 m",
      duration: "3-4 hours",
    },
    description:
      "Amazing sunset views from the canyon ridge. We spotted wildlife and enjoyed perfect weather conditions.",
    status: "past",
  },
]

export function GroupsList() {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="upcoming">Upcoming Hikes</TabsTrigger>
        <TabsTrigger value="past">Past Hikes</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups
            .filter((group) => group.status === "upcoming")
            .map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="past" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups
            .filter((group) => group.status === "past")
            .map((group) => (
              <GroupCard key={group.id} group={group} isPast />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function GroupCard({ group, isPast = false }) {
  const difficultyColors = {
    Easy: "bg-green-500",
    Moderate: "bg-amber-500",
    Difficult: "bg-red-500",
  }

  return (
    <Card className="transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{group.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>{group.date}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{group.location}</span>
            </div>
          </div>
          <Badge variant={group.participants >= group.maxSize ? "destructive" : "outline"}>
            {group.participants}/{group.maxSize} Spots
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Group Leader</div>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={group.leader.image || "/placeholder.svg"} alt={group.leader.name} />
                <AvatarFallback>{group.leader.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span>{group.leader.name}</span>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Participants</div>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {group.memberTypes.slice(0, 4).map((type, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`rounded-full ${
                      type === "Experienced"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300"
                        : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300"
                    }`}
                  >
                    {type.charAt(0)}
                  </Badge>
                ))}
              </div>
              {group.participants > 4 && (
                <Badge variant="outline" className="rounded-full ml-1">
                  +{group.participants - 4}
                </Badge>
              )}
              <div className="flex items-center ml-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>{group.participants} hikers</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Trail Details</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Badge className={`h-5 w-1 mr-2 ${(difficultyColors)[group.trailInfo.difficulty]}`} />
                <span className="text-sm">{group.trailInfo.difficulty}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">{group.trailInfo.duration}</span>
              </div>
              <div className="flex items-center">
                <Mountain className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">{group.trailInfo.elevation}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">{group.trailInfo.distance}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Description</div>
            <p className="text-sm text-muted-foreground line-clamp-3">{group.description}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full bg-green-600 hover:bg-red-500 text-white" >
          {/* <Link href={`/groups/${group.id}`}>{isPast ? "View Details" : "Join Group"}</Link> */}
          Join Group
        
        </Button>
      </CardFooter>
    </Card>
  )
}

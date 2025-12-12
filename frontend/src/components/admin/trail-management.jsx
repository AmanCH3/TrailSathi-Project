"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Plus, MapPin, Clock, Mountain } from "lucide-react"


const trails = [
  {
    id: 1,
    name: "Mount Washington Trail",
    location: "New Hampshire, USA",
    difficulty: "Hard",
    duration: "8-10 hours",
    distance: "8.5 miles",
    elevation: "4,302 ft",
    status: "Active",
    image: "/placeholder.svg?height=200&width=300",
    description: "Challenging summit hike with spectacular views",
    createdDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sunset Ridge Path",
    location: "Vermont, USA",
    difficulty: "Moderate",
    duration: "4-6 hours",
    distance: "5.2 miles",
    elevation: "2,100 ft",
    status: "Active",
    image: "/placeholder.svg?height=200&width=300",
    description: "Beautiful ridge walk with sunset views",
    createdDate: "2024-02-10",
  },
  {
    id: 3,
    name: "Forest Loop Trail",
    location: "Maine, USA",
    difficulty: "Easy",
    duration: "2-3 hours",
    distance: "3.1 miles",
    elevation: "500 ft",
    status: "Maintenance",
    image: "/placeholder.svg?height=200&width=300",
    description: "Family-friendly forest trail",
    createdDate: "2024-01-20",
  },
  {
    id: 4,
    name: "Alpine Lake Circuit",
    location: "Colorado, USA",
    difficulty: "Hard",
    duration: "6-8 hours",
    distance: "7.3 miles",
    elevation: "3,200 ft",
    status: "Active",
    image: "/placeholder.svg?height=200&width=300",
    description: "High-altitude lake with alpine scenery",
    createdDate: "2024-03-05",
  },
]

export function TrailManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTrails = trails.filter((trail) => {
    const matchesSearch =
      trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || trail.difficulty.toLowerCase() === difficultyFilter
    const matchesStatus = statusFilter === "all" || trail.status.toLowerCase() === statusFilter

    return matchesSearch && matchesDifficulty && matchesStatus
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trail Management</h1>
          <p className="text-muted-foreground">Manage hiking trails and routes</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Trail
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search trails by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trails Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrails.map((trail) => (
          <Card key={trail.id} className="overflow-hidden">
            <div className="relative h-48">
              {/* <Image src={trail.image || "/placeholder.svg"} alt={trail.name} fill className="object-cover" /> */}
              <div className="absolute top-2 right-2">
                <Badge variant={trail.status === "Active" ? "default" : "secondary"}>{trail.status}</Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{trail.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {trail.location}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Trail</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Trail</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{trail.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Difficulty:</span>
                  <Badge className={getDifficultyColor(trail.difficulty)}>{trail.difficulty}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Duration:
                  </span>
                  <span className="text-sm">{trail.duration}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Distance:</span>
                  <span className="text-sm">{trail.distance}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Mountain className="h-3 w-3" />
                    Elevation:
                  </span>
                  <span className="text-sm">{trail.elevation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrails.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No trails found</h3>
            <p className="text-muted-foreground text-center">
              No trails match your current filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

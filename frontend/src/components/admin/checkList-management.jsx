"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, MoreHorizontal, Plus, CheckSquare, Trash2, Edit } from "lucide-react"

const checklistTemplates = [
  {
    id: 1,
    name: "Day Hike Essentials",
    category: "Day Hike",
    description: "Essential items for a safe day hike",
    items: [
      { id: 1, name: "Water (2-3 liters)", checked: false, category: "Hydration" },
      { id: 2, name: "Trail snacks/lunch", checked: false, category: "Food" },
      { id: 3, name: "First aid kit", checked: false, category: "Safety" },
      { id: 4, name: "Map and compass/GPS", checked: false, category: "Navigation" },
      { id: 5, name: "Sun protection (hat, sunglasses, sunscreen)", checked: false, category: "Protection" },
      { id: 6, name: "Extra clothing layers", checked: false, category: "Clothing" },
      { id: 7, name: "Headlamp/flashlight", checked: false, category: "Safety" },
      { id: 8, name: "Emergency whistle", checked: false, category: "Safety" },
    ],
    createdDate: "2024-01-15",
    lastModified: "2024-06-10",
    usageCount: 45,
  },
  {
    id: 2,
    name: "Winter Hiking Gear",
    category: "Winter Hike",
    description: "Specialized equipment for winter conditions",
    items: [
      { id: 1, name: "Insulated water bottles", checked: false, category: "Hydration" },
      { id: 2, name: "High-energy snacks", checked: false, category: "Food" },
      { id: 3, name: "Microspikes/crampons", checked: false, category: "Footwear" },
      { id: 4, name: "Snowshoes", checked: false, category: "Equipment" },
      { id: 5, name: "Insulated jacket", checked: false, category: "Clothing" },
      { id: 6, name: "Waterproof gloves", checked: false, category: "Clothing" },
      { id: 7, name: "Warm hat/balaclava", checked: false, category: "Clothing" },
      { id: 8, name: "Emergency bivy", checked: false, category: "Safety" },
      { id: 9, name: "Hand/foot warmers", checked: false, category: "Warmth" },
    ],
    createdDate: "2024-02-01",
    lastModified: "2024-05-20",
    usageCount: 23,
  },
  {
    id: 3,
    name: "Multi-Day Backpacking",
    category: "Backpacking",
    description: "Complete gear list for overnight trips",
    items: [
      { id: 1, name: "Backpack (40-60L)", checked: false, category: "Equipment" },
      { id: 2, name: "Tent/shelter", checked: false, category: "Shelter" },
      { id: 3, name: "Sleeping bag", checked: false, category: "Sleep" },
      { id: 4, name: "Sleeping pad", checked: false, category: "Sleep" },
      { id: 5, name: "Cooking stove and fuel", checked: false, category: "Cooking" },
      { id: 6, name: "Cookware and utensils", checked: false, category: "Cooking" },
      { id: 7, name: "Water filter/purification", checked: false, category: "Hydration" },
      { id: 8, name: "Food for all meals", checked: false, category: "Food" },
      { id: 9, name: "Bear canister/rope", checked: false, category: "Safety" },
      { id: 10, name: "Personal hygiene items", checked: false, category: "Personal" },
    ],
    createdDate: "2024-01-20",
    lastModified: "2024-06-05",
    usageCount: 18,
  },
  {
    id: 4,
    name: "Family Hike Checklist",
    category: "Family",
    description: "Kid-friendly hiking essentials",
    items: [
      { id: 1, name: "Extra water for kids", checked: false, category: "Hydration" },
      { id: 2, name: "Kid-friendly snacks", checked: false, category: "Food" },
      { id: 3, name: "First aid kit with band-aids", checked: false, category: "Safety" },
      { id: 4, name: "Entertainment (games, books)", checked: false, category: "Entertainment" },
      { id: 5, name: "Extra clothing for kids", checked: false, category: "Clothing" },
      { id: 6, name: "Baby wipes", checked: false, category: "Personal" },
      { id: 7, name: "Camera", checked: false, category: "Equipment" },
      { id: 8, name: "Trash bags", checked: false, category: "Environment" },
    ],
    createdDate: "2024-03-01",
    lastModified: "2024-06-01",
    usageCount: 32,
  },
]

export function ChecklistTemplates() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredTemplates = checklistTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "day hike":
        return "bg-blue-100 text-blue-800"
      case "winter hike":
        return "bg-cyan-100 text-cyan-800"
      case "backpacking":
        return "bg-green-100 text-green-800"
      case "family":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklist Templates</h1>
          <p className="text-muted-foreground">Create and manage packing checklist templates</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Checklist Template</DialogTitle>
              <DialogDescription>Create a new packing checklist template for specific hike types</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input id="template-name" placeholder="e.g., Summer Day Hike" />
                </div>
                <div>
                  <Label htmlFor="template-category">Category</Label>
                  <Input id="template-category" placeholder="e.g., Day Hike" />
                </div>
              </div>
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea id="template-description" placeholder="Brief description of this template..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Template</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                  <Badge className={`mt-2 ${getCategoryColor(template.category)}`} variant="outline">
                    {template.category}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Template
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <div className="text-sm font-medium">Items ({template.items.length})</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {template.items.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox id={`item-${item.id}`} />
                      <label
                        htmlFor={`item-${item.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.name}
                      </label>
                    </div>
                  ))}
                  {template.items.length > 6 && (
                    <div className="text-xs text-muted-foreground">+{template.items.length - 6} more items...</div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Used {template.usageCount} times</span>
                  <span>Modified {template.lastModified}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground text-center">
              No checklist templates match your search criteria. Try adjusting your search or create a new template.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

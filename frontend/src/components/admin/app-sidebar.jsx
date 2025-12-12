"use client"
import { 
  BarChart3, 
  CheckSquare, 
  CreditCard, 
  Home, 
  LogOut, 
  MapPin, 
  Mountain, 
  Settings, 
  Users 
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { LogoutModal } from "./logout-modal"
import { useAuth } from "@app/providers/AuthProvider";
import { Link, useLocation } from "react-router-dom"

const navigationData = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: Home,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "User Management",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Trail Management",
          url: "/admin/trail",
          icon: MapPin,
        },
        {
          title: "Group Hikes",
          url: "/admin/hikes",
          icon: Mountain,
        },
        {
          title: "Checklist Templates",
          url: "/admin/checklists",
          icon: CheckSquare,
        },
      ],
    },
    {
      title: "Financial",
      items: [
        {
          title: "Payments & Reports",
          url: "/admin/payments",
          icon: CreditCard,
        },
      ],
    },
  ],
}

export function AppSidebar() {
  const { logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const location = useLocation()

  const handleLogoutClick = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const handleConfirmLogout = () => {
    logout()
    setIsModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const isActiveRoute = (url) => {
    return location.pathname === url
  }

  return (
    <>
      <Sidebar className="border-r border-border/40">
        <SidebarHeader className="border-b border-border/40">
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-sm">
              <Mountain className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold tracking-tight">HikeHub</h1>
              <p className="text-xs text-muted-foreground font-medium">
                Admin Dashboard
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <div className="space-y-1">
            {navigationData.navMain.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent className="mt-2">
                  <SidebarMenu className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = isActiveRoute(item.url)
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                            className={`
                              mx-2 h-10 rounded-lg px-3 transition-all duration-200
                              ${isActive 
                                ? 'bg-green-50 text-green-700 font-medium shadow-sm border border-green-200/50 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800/50' 
                                : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                              }
                            `}
                          >
                            <Link to={item.url} className="flex items-center gap-3 w-full">
                              <item.icon className={`h-4 w-4 ${isActive ? 'text-green-600 dark:text-green-400' : ''}`} />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogoutClick}
                    className="mx-2 h-10 rounded-lg px-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  )
}
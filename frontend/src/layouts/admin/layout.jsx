import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "../../components/admin/app-sidebar"

// Helper function to get page title from pathname
const getPageTitle = (pathname) => {
  const routes = {
    '/dashboard': 'Dashboard',
    '/admin/users': 'User Management',
    '/admin/trails': 'Trail Management',
    '/admin/hikes': 'Group Hikes',
    '/admin/checklists': 'Checklist Templates',
    '/admin/payments': 'Payments & Reports',
    '/admin/settings': 'Settings'
  }
  return routes[pathname] || 'Dashboard'
}

export default function AdminLayout() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">HikeHub Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
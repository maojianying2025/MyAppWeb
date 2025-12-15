import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutGrid, 
  Plus, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  HelpCircle,
  Folder,
  Users,
  BarChart3,
  Menu as MenuIcon,
  Briefcase,
  X,
  TrendingUp,
  UserCircle,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutGrid,
  },
  {
    title: "Tasks",
    url: createPageUrl("Tasks"),
    icon: Briefcase,
  },
  {
    title: "CRM",
    url: createPageUrl("CrmCustomers"),
    icon: UserCircle,
  },
  {
    title: "TPA",
    url: createPageUrl("TPAManagement"),
    icon: Users,
  },
  {
    title: "Support",
    url: createPageUrl("Support"),
    icon: HelpCircle,
  },
  {
    title: "Config Center",
    url: createPageUrl("ConfigCenter"),
    icon: Sliders,
  },
];



export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F5F6F8]">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b">
              <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-[#323338] text-xl">SCM</span>
              </Link>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.url
                        ? 'bg-[#E1E5F3] text-[#0073EA]'
                        : 'text-[#323338] hover:bg-[#F5F6F8] hover:text-[#0073EA]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0073EA] to-[#00C875] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">User</div>
                  <div className="text-xs text-gray-500">Role: Admin</div>
                </div>
              </div>
              <div className="space-y-1">
                <Link to={createPageUrl("Profile")} onClick={() => setSidebarOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm"
                  onClick={() => base44.auth.logout()}
                >
                  Sign out
                </Button>
              </div>
            </div>
            </div>
        </SheetContent>

        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <nav className="bg-white border-b border-[#E1E5F3] shadow-sm sticky top-0 z-50">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Section: Menu Button */}
              <div className="flex items-center gap-4">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-[#E1E5F3] rounded-lg h-10 w-10">
                    <MenuIcon className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              
              <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-[#323338] text-xl hidden sm:inline">SCM</span>
              </Link>
            </div>

            {/* Center Section: Search (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#0073EA] focus:border-[#0073EA] sm:text-sm"
                    placeholder="Search everything..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Section: Icons */}
            <div className="hidden md:ml-4 md:flex md:items-center md:space-x-2">
              <Button variant="ghost" size="icon" className="hover:bg-[#E1E5F3] rounded-lg h-10 w-10">
                <Bell className="w-5 h-5 text-[#676879]" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-[#E1E5F3] rounded-lg h-10 w-10">
                <HelpCircle className="w-5 h-5 text-[#676879]" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-[#E1E5F3] rounded-lg h-10 w-10">
                <SettingsIcon className="w-5 h-5 text-[#676879]" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </Sheet>
    </div>
  );

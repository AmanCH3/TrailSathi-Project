import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaSearch, FaChevronDown, FaRegCompass } from "react-icons/fa";
import { useAuth } from "@app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { ENV } from "@config/env";

const API_URL = ENV.API_URL;


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "./NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

import WeatherWidget from "../common/WeatherWidget";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <nav className="bg-gray-100/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center px-6 py-3">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-red-50 p-1.5 rounded-full border border-red-100 group-hover:scale-105 transition-transform">
                <FaRegCompass className="text-red-500 text-xl" />
            </div>
          <span className="text-xl font-bold text-black tracking-tight">
            TrailSathi
          </span>
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
           <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaSearch className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search by city, park, or trail name" 
                className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-sm border-0 shadow-sm focus:ring-2 focus:ring-green-500/20 text-gray-700 placeholder:text-gray-400 font-medium"
              />
           </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-600">
             
             {/* Explore Dropdown */}
             <div className="relative group cursor-pointer h-full flex items-center gap-1.5 hover:text-black transition-colors py-2">
                Explore <FaChevronDown className="text-[10px] transition-transform group-hover:rotate-180" />
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1.5">
                        <Link to="/trails" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-black transition-colors">Trails</Link>
                        <Link to="/checklist" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-black transition-colors">Checklist</Link>
                        <Link to="/community/groups" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-black transition-colors">Groups</Link>
                        <Link to="/payments" className="block px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-black transition-colors">Payment</Link>
                    </div>
                </div>
             </div>

             <div className="cursor-pointer hover:text-black transition-colors">
                <Link to="/saved">Saved</Link>
             </div>

             {isAuthenticated ? (
             <div className="flex items-center gap-4 pl-2">
                 
                 <NotificationDropdown />
                 
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                            <Avatar className="h-9 w-9 border border-gray-200">
                                <AvatarImage src={user.profileImage ? `${API_URL}/${user.profileImage}` : ''} alt={user.name} />
                                <AvatarFallback className="bg-green-100 text-green-700 text-xs">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-gray-900 font-semibold">{user.name}</span>
                            <FaChevronDown className="text-gray-400 text-xs" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/profile" className="cursor-pointer w-full flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
             ) : (
                 <Link to="/signup">
                    <button className="bg-[#3A5A40] hover:bg-[#2f4a33] text-white px-6 py-2 rounded-[4px] text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95">
                        Register
                    </button>
                 </Link>
             )}
        </div>

         {/* Mobile Menu Button */}
         <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>
      
       {/* Mobile Menu */}
       {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 absolute w-full shadow-lg z-50">
             <div className="flex flex-col gap-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-gray-100 rounded-lg py-2 pl-9 pr-4 text-sm"
                    />
                </div>
                <Link to="/trails" className="font-medium text-gray-700 py-2">Trails</Link>
                <Link to="/checklist" className="font-medium text-gray-700 py-2">Checklist</Link>
                 <Link to="/community/groups" className="font-medium text-gray-700 py-2">Groups</Link>
                <Link to="/saved" className="font-medium text-gray-700 py-2">Saved</Link>
                {isAuthenticated ? (
                     <button onClick={logout} className="text-red-600 text-left font-medium py-2">Logout</button>
                ) : (
                    <Link to="/signup" className="text-center bg-[#3A5A40] text-white py-2 rounded-lg font-bold">Register</Link>
                )}
             </div>
        </div>
       )}
    </nav>
  );
}

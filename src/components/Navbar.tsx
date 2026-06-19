// components/Navbar.tsx
"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface NavbarProps {
  role?: "admin" | "teacher" | "student" | "parent";
}

const Navbar = ({ role }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");
    
    if (storedRole) {
      setUserRole(storedRole);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }

    // Fetch user details from API
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.firstName && data.lastName) {
            setUserName(`${data.firstName} ${data.lastName}`);
          } else if (data.username) {
            setUserName(data.username);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();

    // Fetch notification count
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications/count");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    // Close profile menu on click outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    
    // Clear cookies
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "userId=; path=/; max-age=0";
    
    toast.success("Logged out successfully");
    router.push("/sign-in");
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    if (userId) {
      router.push(`/profile?userId=${userId}`);
    } else {
      router.push("/profile");
    }
  };

  const handleNotificationsClick = () => {
    router.push("/list/announcements");
  };

  const getInitials = () => {
    if (userName && userName !== "User") {
      const names = userName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return userName[0].toUpperCase();
    }
    return "U";
  };

  const getRoleColor = () => {
    const colors = {
      ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
      TEACHER: "bg-blue-100 text-blue-700 border-blue-200",
      STUDENT: "bg-green-100 text-green-700 border-green-200",
      PARENT: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[userRole as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        
        {/* 🔍 SEARCH BAR */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md bg-gray-50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-400 focus-within:bg-white transition-all duration-200 border border-gray-200 hover:border-purple-300">
          <Image src="/search.png" alt="search" width={16} height={16} className="opacity-60"/>
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
          />
          <kbd className="hidden lg:block text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">⌘K</kbd>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center">
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            LMS
          </span>
        </div>

        {/* 🔔 RIGHT SECTION */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* 💬 MESSAGE ICON */}
          <button 
            className="relative group p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            aria-label="Messages"
          >
            <div className="relative">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </button>

          {/* 🔔 NOTIFICATION */}
          <button 
            onClick={handleNotificationsClick}
            className="relative group p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            aria-label="Notifications"
          >
            <div className="relative">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              
              {/* Badge */}
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-[10px] font-bold shadow-lg animate-bounce">
                  {notifications > 9 ? '9+' : notifications}
                </div>
              )}
            </div>
          </button>

          {/* 👤 USER INFO */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-700 truncate max-w-[120px]">
              {userName}
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {userRole || "User"}
            </span>
          </div>

          {/* 🖼 AVATAR with Dropdown */}
          <div className="relative profile-menu-container">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 focus:outline-none group"
              aria-label="Profile menu"
            >
              <div className="relative">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  border-2 transition-all duration-200
                  ${getRoleColor()}
                  ${isProfileMenuOpen ? 'ring-2 ring-purple-400 ring-offset-2' : 'group-hover:border-purple-400'}
                `}>
                  {getInitials()}
                </div>

                {/* Online dot */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Chevron */}
              <svg className={`
                w-4 h-4 text-gray-400 transition-transform duration-200
                ${isProfileMenuOpen ? 'rotate-180' : ''}
              `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown">
                {/* User Info Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                      ${getRoleColor()}
                    `}>
                      {getInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{userRole || "User"}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Profile</span>
                    <span className="ml-auto text-xs text-gray-400">⌘P</span>
                  </button>

                  <button
                    onClick={handleNotificationsClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span>Notifications</span>
                    {notifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {notifications}
                      </span>
                    )}
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                    <span className="ml-auto text-xs text-gray-400">⌘Q</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
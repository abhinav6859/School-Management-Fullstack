"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface NavbarProps {
  role?: "admin" | "teacher" | "student" | "parent";
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ role, sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Get user info from localStorage
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("email");
    
    if (storedRole) setUserRole(storedRole);
    if (storedUserId) setUserId(storedUserId);
    if (storedName) setUserName(storedName);
    
    if (!storedName && storedEmail) {
      const emailName = storedEmail.split('@')[0];
      setUserName(emailName);
    }

    // Close profile menu on click outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("cachedProfile");
    localStorage.removeItem("profileCacheTimestamp");
    
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
    <div className="sticky top-0 z-40">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        
        {/* Left Section - Hamburger & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu Button */}
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center">
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SchooLama
            </span>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4 bg-gray-50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-400 focus-within:bg-white transition-all duration-200 border border-gray-200 hover:border-purple-300">
          <Image 
            src="/search.png" 
            alt="search" 
            width={16} 
            height={16} 
            className="opacity-60 flex-shrink-0"
            loading="lazy"
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
          />
          <kbd className="hidden lg:block text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">⌘K</kbd>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          
          {/* User Info - Hidden on very small screens */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate max-w-[80px] sm:max-w-[120px]">
              {userName}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
              {userRole || "User"}
            </span>
          </div>

          {/* Avatar with Dropdown */}
          <div className="relative profile-menu-container">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1 sm:gap-2 focus:outline-none group"
              aria-label="Profile menu"
            >
              <div className="relative">
                <div className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm
                  border-2 transition-all duration-200
                  ${getRoleColor()}
                  ${isProfileMenuOpen ? 'ring-2 ring-purple-400 ring-offset-2' : 'group-hover:border-purple-400'}
                `}>
                  {getInitials()}
                </div>

                {/* Online dot - Hidden on very small screens */}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Chevron - Hidden on very small screens */}
              <svg className={`
                hidden sm:block w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200
                ${isProfileMenuOpen ? 'rotate-180' : ''}
              `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown">
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
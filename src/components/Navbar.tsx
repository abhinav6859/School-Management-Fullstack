// components/Navbar.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarProps {
  role?: "admin" | "teacher" | "student" | "parent";
}

const Navbar = ({ role }: NavbarProps) => {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user info from localStorage
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    
    if (storedRole) {
      setUserRole(storedRole);
    }

    // You can fetch user details from an API here
    // For now, use localStorage or set a default
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      // Set default name based on role
      const defaultNames = {
        ADMIN: "Admin",
        TEACHER: "Teacher",
        STUDENT: "Student",
        PARENT: "Parent",
      };
      setUserName(defaultNames[storedRole as keyof typeof defaultNames] || "User");
    }
  }, []);

  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    
    // Clear cookies
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    
    // Redirect to sign-in
    router.push("/sign-in");
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      
      {/* 🔍 SEARCH BAR */}
      <div className="hidden md:flex items-center gap-3 w-[320px] bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
        <Image src="/search.png" alt="search" width={16} height={16} className="opacity-60"/>
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
        />
      </div>

      {/* 🔔 RIGHT SECTION */}
      <div className="flex items-center gap-5 justify-end w-full">
        
        {/* 💬 MESSAGE ICON */}
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-purple-100 transition">
            <Image src="/message.png" alt="message" width={18} height={18} className="group-hover:scale-110 transition"/>
          </div>
        </div>

        {/* 🔔 NOTIFICATION */}
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-purple-100 transition">
            <Image src="/announcement.png" alt="notification" width={18} height={18} className="group-hover:scale-110 transition"/>
          </div>

          {/* Badge */}
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-[10px] font-semibold shadow">
            1
          </div>
        </div>

        {/* 👤 USER INFO */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-semibold text-gray-700">{userName}</span>
          <span className="text-xs text-gray-400">{userRole}</span>
        </div>

        {/* 🖼 AVATAR with Logout */}
        <div className="relative group cursor-pointer" onClick={handleLogout}>
          <Image
            src="/avatar.png"
            alt="avatar"
            width={38}
            height={38}
            className="rounded-full border-2 border-transparent group-hover:border-purple-400 transition"
          />

          {/* Online dot */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Logout Button (optional) */}
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
"use client";

import Image from "next/image";

const Navbar = () => {
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
          <span className="text-sm font-semibold text-gray-700">John Doe</span>
          <span className="text-xs text-gray-400">Admin</span>
        </div>

        {/* 🖼 AVATAR */}
        <div className="relative cursor-pointer group">
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

      </div>
    </div>
  );
};

export default Navbar;
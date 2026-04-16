import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      
      {/* LEFT: LOGO / TITLE */}
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold tracking-wide text-gray-800">
          Dashboard
        </div>
      </div>

      {/* CENTER: SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 w-[350px] bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition">
        <Image src="/search.png" alt="search" width={16} height={16} />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* RIGHT: ICONS + USER */}
      <div className="flex items-center gap-5">

        {/* MESSAGE ICON */}
        <div className="relative group cursor-pointer">
          <div className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition">
            <Image src="/message.png" alt="message" width={20} height={20} />
          </div>
        </div>

        {/* NOTIFICATION ICON */}
        <div className="relative group cursor-pointer">
          <div className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition">
            <Image src="/announcement.png" alt="notification" width={20} height={20} />
          </div>

          {/* BADGE */}
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-purple-500 text-white text-[10px] rounded-full animate-pulse">
            3
          </span>
        </div>

        {/* USER INFO */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-medium text-gray-800">John Doe</span>
          <span className="text-xs text-gray-500">Admin</span>
        </div>

        {/* AVATAR */}
        <div className="cursor-pointer">
          <Image
            src="/avatar.png"
            alt="user"
            width={38}
            height={38}
            className="rounded-full border-2 border-purple-400 hover:scale-105 transition"
          />
        </div>

      </div>
    </div>
  );
};

export default Navbar;
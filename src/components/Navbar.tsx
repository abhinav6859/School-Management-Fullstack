import React from 'react'
import Image from "next/image";

const Navbar = () => {
  return (
    <div>
         <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src="/search.png" alt="" width={14} height={14}/>
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none"/>
        </div>
      {/* ICONS */}
      <div className='flex items-center gap-4'> 
      </div>
    </div>
    </div>
  )
}

export default Navbar

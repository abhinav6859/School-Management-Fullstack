// components/UserCard.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserCardProps {
  type: string;
}

interface Counts {
  student: { count: number; year: string };
  teacher: { count: number; year: string };
  parent: { count: number; year: string };
  admin: { count: number; year: string };
}

let cachedCounts: Counts | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const UserCard = ({ type }: UserCardProps) => {
  const [count, setCount] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCounts();
  }, []);

  const fetchAllCounts = async () => {
    try {
      // Check cache first
      if (cachedCounts && Date.now() - cacheTimestamp < CACHE_DURATION) {
        updateCount(cachedCounts);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await fetch("/api/dashboard/counts");
      
      if (!res.ok) {
        throw new Error("Failed to fetch counts");
      }
      
      const data = await res.json();
      
      // Cache the results
      cachedCounts = data;
      cacheTimestamp = Date.now();
      
      updateCount(data);
    } catch (error) {
      console.error("Failed to fetch counts:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const updateCount = (data: Counts) => {
    const map: Record<string, keyof Counts> = {
      student: "student",
      teacher: "teacher",
      parent: "parent",
      admin: "admin",
    };
    const key = map[type.toLowerCase()];
    if (key && data[key]) {
      setCount(data[key].count);
      setYear(data[key].year);
    }
  };

  const getColorClasses = () => {
    const colors: Record<string, string> = {
      student: "from-blue-500 to-blue-600",
      teacher: "from-purple-500 to-purple-600",
      parent: "from-yellow-500 to-yellow-600",
      admin: "from-red-500 to-red-600",
    };
    return colors[type.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  const getIcon = () => {
    const icons: Record<string, string> = {
      student: "/students.png",
      teacher: "/teacher.png",
      parent: "/parents.png",
      admin: "/admin.png",
    };
    return icons[type.toLowerCase()] || "/more.png";
  };

  const getLabel = () => {
    const labels: Record<string, string> = {
      student: "Students",
      teacher: "Teachers",
      parent: "Parents",
      admin: "Admins",
    };
    return labels[type.toLowerCase()] || type;
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-4 flex-1 min-w-[130px] bg-gray-100 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded my-4"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-4 flex-1 min-w-[130px] bg-gradient-to-br ${getColorClasses()} text-white shadow-md hover:shadow-lg transition-all duration-200`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white">
          {year}
        </span>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Image 
            src={getIcon()} 
            alt={type} 
            width={16} 
            height={16} 
            className="opacity-90"
          />
        </div>
      </div>
      <h1 className="text-2xl font-semibold my-2">
        {count.toLocaleString()}
      </h1>
      <h2 className="capitalize text-sm font-medium text-white/80">
        {getLabel()}
      </h2>
    </div>
  );
};

export default UserCard;
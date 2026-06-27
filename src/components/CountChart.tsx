"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

interface ChartData {
  name: string;
  count: number;
  fill: string;
}

interface StudentStats {
  total: number;
  boys: number;
  girls: number;
  boysPercentage: number;
  girlsPercentage: number;
}

const CountChart = () => {
  const [data, setData] = useState<ChartData[]>([
    {
      name: "Girls",
      count: 0,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: 0,
      fill: "#C3EBFA",
    },
  ]);
  const [stats, setStats] = useState<StudentStats>({
    total: 0,
    boys: 0,
    girls: 0,
    boysPercentage: 0,
    girlsPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students/stats");
      
      if (!res.ok) {
        throw new Error("Failed to fetch student stats");
      }
      
      const result = await res.json();
      
      setData([
        {
          name: "Girls",
          count: result.girls || 0,
          fill: "#FAE27C",
        },
        {
          name: "Boys",
          count: result.boys || 0,
          fill: "#C3EBFA",
        },
      ]);
      
      setStats({
        total: result.total || 0,
        boys: result.boys || 0,
        girls: result.girls || 0,
        boysPercentage: result.boysPercentage || 0,
        girlsPercentage: result.girlsPercentage || 0,
      });
    } catch (error) {
      console.error("Failed to fetch student stats:", error);
      toast.error("Failed to load student statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl w-full h-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Students</h1>
          <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="animate-pulse">
            <div className="w-32 h-32 rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="flex justify-center gap-16 mt-4">
          <div className="flex flex-col gap-1 items-center">
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-base sm:text-lg font-semibold">Students</h1>
        <button 
          onClick={fetchStudentStats}
          className="p-1 hover:bg-gray-100 rounded-full transition"
          title="Refresh data"
        >
          <Image src="/moreDark.png" alt="Refresh" width={20} height={20} />
        </button>
      </div>
      
      {/* CHART */}
      <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px]">
        {stats.total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="80%"
              barSize={15}
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background
                dataKey="count"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">No data available</p>
          </div>
        )}
        
        {/* Center Content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center">
              <Image
                src="/maleFemale.png"
                alt="Students"
                width={24}
                height={24}
                className="sm:w-[28px] sm:h-[28px]"
              />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-800">
            {stats.total}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400">
            Total Students
          </div>
        </div>
      </div>
      
      {/* BOTTOM - Stats */}
      <div className="flex justify-center gap-8 sm:gap-12 md:gap-16 mt-2">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-[#C3EBFA] rounded-full" />
            <span className="text-[10px] sm:text-xs text-gray-500">Boys</span>
          </div>
          <div className="font-bold text-sm sm:text-base">
            {stats.boys.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-300">
            {stats.boysPercentage}%
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-[#FAE27C] rounded-full" />
            <span className="text-[10px] sm:text-xs text-gray-500">Girls</span>
          </div>
          <div className="font-bold text-sm sm:text-base">
            {stats.girls.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-300">
            {stats.girlsPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
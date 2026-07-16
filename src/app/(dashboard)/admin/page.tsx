// app/(dashboard)/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserCard from "@/components/UserCard";
import CountChart from "@/components/CountChart";
import AttendanceChart from "@/components/AttendanceChart";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      console.log("Admin page - Token:", !!token, "Role:", role);

      if (!token || role !== "ADMIN") {
        router.push("/sign-in");
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("Error in admin page:", err);
      setError("Failed to load admin page");
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
  <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6">
     
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"> 
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="admin" />
          
        </div>
     
        <div className="flex gap-4 flex-col lg:flex-row">
         
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
         
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
       
      </div>
      
      <div className="calendar-wrapper w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}
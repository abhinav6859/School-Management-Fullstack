// app/(dashboard)/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserCard from "@/components/UserCard";
import CountChart from "@/components/CountChart";
import AttendanceChart from "@/components/AttendanceChart";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import toast from "react-hot-toast";

// ---------- Cache (module‑level) ----------
interface Counts {
  student: { count: number; year: string };
  teacher: { count: number; year: string };
  parent: { count: number; year: string };
  admin: { count: number; year: string };
}

let cachedCounts: Counts | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ---------- Component ----------
export default function AdminPage() {
  const router = useRouter();

  // Auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Counts state
  const [counts, setCounts] = useState<Counts | null>(null);
  const [countsLoading, setCountsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Authentication check
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "ADMIN") {
     router.replace("/sign-in");
        return;
      }
      setAuthenticated(true);
    } catch (err) {
      console.error("Auth error:", err);
      setError("Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  // 2. Fetch counts (only when authenticated, with cache)
  useEffect(() => {
    if (!authenticated) return;

    const fetchCounts = async () => {
      // Check cache first
      if (cachedCounts && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setCounts(cachedCounts);
        setCountsLoading(false);
        return;
      }

      setCountsLoading(true);
      try {
        const res = await fetch("/api/dashboard/counts");
        if (!res.ok) throw new Error("Failed to fetch counts");
        const data = await res.json();

        // Update cache
        cachedCounts = data;
        cacheTimestamp = Date.now();

        setCounts(data);
      } catch (err) {
        console.error("Counts fetch error:", err);
        toast.error("Failed to load dashboard data");
        setError("Could not load statistics");
      } finally {
        setCountsLoading(false);
      }
    };

    fetchCounts();
  }, [authenticated]);

  // Loading / error screens
  if (authLoading) {
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

  // Build card data from counts (or fallback to zero if still loading)
  const cardTypes = ["student", "teacher", "parent", "admin"] as const;
  const cards = cardTypes.map((type) => ({
    type,
    count: counts?.[type]?.count ?? 0,
    year: counts?.[type]?.year ?? new Date().getFullYear().toString(),
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {countsLoading
            ? // Show skeleton cards while loading
              cardTypes.map((type) => (
                <UserCard key={type} type={type} loading />
              ))
            : // Render actual cards with data
              cards.map((card) => (
                <UserCard
                  key={card.type}
                  type={card.type}
                  count={card.count}
                  year={card.year}
                />
              ))}
        </div>

        {/* Charts (they may have their own data fetching) */}
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
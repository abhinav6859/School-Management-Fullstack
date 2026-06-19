// app/(protected)/list/announcements/page.tsx
"use client";

import { useState, useEffect } from "react";
import AnnouncementForm from "@/components/forms/AnnouncementForm";
import AnnouncementList from "@/components/list/AnnouncementList";
import toast from "react-hot-toast";

export default function AnnouncementsPage() {
  const [refresh, setRefresh] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    setLoading(false);
  }, []);

  // Check if user can create announcements (ADMIN and TEACHER)
  const canCreateAnnouncement = userRole === "ADMIN" || userRole === "TEACHER";

  // If still loading, show skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>📢</span> Announcements
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {canCreateAnnouncement ? "Admin/Teacher" : "Student/Parent"}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {canCreateAnnouncement 
                ? "Create and manage important announcements" 
                : "Stay updated with latest announcements"}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-600 font-medium">Total</div>
              <div className="text-lg font-bold text-purple-700">--</div>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Recent</div>
              <div className="text-lg font-bold text-blue-700">--</div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Form - Only for ADMIN and TEACHER */}
      {canCreateAnnouncement ? (
        <div className="mb-8">
          <AnnouncementForm
            onAnnouncementAdded={() => setRefresh((prev) => prev + 1)}
          />
        </div>
      ) : (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👀</span>
            <div>
              <h3 className="font-semibold text-purple-800">View Only Mode</h3>
              <p className="text-sm text-purple-700">
                You can view all announcements and stay informed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Announcement List */}
      <AnnouncementList refresh={refresh} />
    </div>
  );
}
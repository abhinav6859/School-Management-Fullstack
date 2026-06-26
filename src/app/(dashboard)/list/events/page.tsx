// app/(protected)/list/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import EventForm from "@/components/forms/EventForm";
import EventList from "@/components/list/EventList";
import Pagination from "@/components/Pagination";

export default function EventsPage() {
  const [refresh, setRefresh] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Get role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
    setLoading(false);
  }, []);

  // Check if user can create events (ADMIN and TEACHER)
  const canCreateEvent = userRole === "ADMIN" || userRole === "TEACHER";

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setRefresh((prev) => prev + 1);
  };

  // If still loading, show skeleton
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-10">
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
    <div className="max-w-6xl mx-auto p-4 md:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span>📅</span> Event Management
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {canCreateEvent ? "Admin/Teacher" : "Student/Parent"}
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {canCreateEvent 
            ? "Create and manage events for your school" 
            : "View upcoming events and school activities"}
        </p>
      </div>

      {/* Event Form - Only for ADMIN and TEACHER */}
      {canCreateEvent ? (
        <EventForm
          onEventAdded={() => setRefresh((prev) => prev + 1)}
        />
      ) : (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-semibold text-purple-800">View Only Mode</h3>
              <p className="text-sm text-purple-700">
                You can view all events and school activities here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Event List - Pass page prop */}
      <EventList 
        refresh={refresh} 
        page={currentPage}
        onTotalPagesChange={setTotalPages}
      />

      {/* Pagination - Only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination 
            page={currentPage}
            count={totalPages}
            
          />
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import AssignmentForm from "@/components/forms/AssignmentForm";
import AssignmentList from "@/components/list/AssignmentList";
import Pagination from "@/components/Pagination";

export default function AssignmentsPage() {
  const [refresh, setRefresh] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    setLoading(false);
  }, []);

  // Check if user can create assignments (ADMIN and TEACHER)
  const canCreateAssignment = userRole === "ADMIN" || userRole === "TEACHER";

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setRefresh((prev) => prev + 1);
  };

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
              <span>📋</span> Assignment Management
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {canCreateAssignment ? "Admin/Teacher" : "Student"}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {canCreateAssignment 
                ? "Create and manage assignments for your students" 
                : "View and submit your assignments"}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Total Assignments</div>
              <div className="text-lg font-bold text-blue-700">--</div>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium">Pending</div>
              <div className="text-lg font-bold text-green-700">--</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Form - Only for ADMIN and TEACHER */}
      {canCreateAssignment ? (
        <AssignmentForm
          onAssignmentAdded={() => setRefresh((prev) => prev + 1)}
        />
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-semibold text-blue-800">Student View</h3>
              <p className="text-sm text-blue-700">
                You can view all assignments and track your submissions here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assignment List - Pass page prop */}
      <AssignmentList 
        refresh={refresh} 
       
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
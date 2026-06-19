// app/(protected)/list/attendance/page.tsx
"use client";

import { useState, useEffect } from "react";
import AttendanceForm from "@/components/forms/AttendanceForm";
import AttendanceList from "@/components/list/AttendanceList";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    setLoading(false);
  }, []);

  const canCreateAttendance = userRole === "ADMIN" || userRole === "TEACHER";

  const handleAttendanceAdded = () => {
    setRefresh((prev) => prev + 1);
    setShowModal(false);
    toast.success("Attendance recorded successfully!");
  };

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
              <span>📋</span> Attendance Management
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {canCreateAttendance ? "Admin/Teacher" : "Student"}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {canCreateAttendance 
                ? "Track and manage student attendance records" 
                : "View your attendance history"}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium">Present</div>
              <div className="text-lg font-bold text-green-700">--</div>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200">
              <div className="text-xs text-red-600 font-medium">Absent</div>
              <div className="text-lg font-bold text-red-700">--</div>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Total</div>
              <div className="text-lg font-bold text-blue-700">--</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Attendance Button - Only for ADMIN and TEACHER */}
      {canCreateAttendance ? (
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Attendance
        </button>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👀</span>
            <div>
              <h3 className="font-semibold text-blue-800">View Only Mode</h3>
              <p className="text-sm text-blue-700">
                You can view your attendance records and track your presence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance List */}
      <AttendanceList refresh={refresh} />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-white border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <h2 className="text-xl font-bold text-gray-900">
                  Record Attendance
                </h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {userRole?.toLowerCase()}
                </span>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <AttendanceForm
                onAttendanceAdded={handleAttendanceAdded}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
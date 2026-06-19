"use client";

import { useState, useEffect } from "react";
import ResultForm from "@/components/forms/ResultForm";
import ResultList from "@/components/list/ResultList";

export default function ResultsPage() {
  const [refresh, setRefresh] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    setLoading(false);
  }, []);

  const canCreateResult =
    userRole === "ADMIN" || userRole === "TEACHER";

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

  const handleResultAdded = () => {
    setRefresh((prev) => prev + 1);
    setIsFormOpen(false); // Close popup after submit
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span>📊</span> Results Management
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {canCreateResult ? "Admin/Teacher" : "Student/Parent"}
              </span>
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {canCreateResult
                ? "Manage and publish student results"
                : "View your academic results and performance"}
            </p>
          </div>

          {/* Add Result Button */}
          {canCreateResult && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow"
            >
              + Add Result
            </button>
          )}
        </div>
      </div>

      {/* View Only Message */}
      {!canCreateResult && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h3 className="font-semibold text-indigo-800">
                View Only Mode
              </h3>
              <p className="text-sm text-indigo-700">
                You can view all results and track your academic
                performance here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">
                Add New Result
              </h2>

              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="p-4">
              <ResultForm
                onResultAdded={handleResultAdded}
              />
            </div>
          </div>
        </div>
      )}

      {/* Result List */}
      <ResultList refresh={refresh} />
    </div>
  );
}
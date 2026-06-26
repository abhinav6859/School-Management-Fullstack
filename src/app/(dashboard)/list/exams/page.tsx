"use client";

import { useState, useEffect } from "react";
import ExamForm from "@/components/forms/ExamForm";
import ExamList from "@/components/list/ExamList";
import Pagination from "@/components/Pagination";

export default function ExamsPage() {
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

  // Check if user can create exams
  const canCreateExam = userRole === "ADMIN" || userRole === "TEACHER";

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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Exam Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          {canCreateExam 
            ? "Create and manage exams for your classes" 
            : "View exams and your results"}
        </p>
      </div>

      {/* Exam Form - Only for ADMIN and TEACHER */}
      {canCreateExam ? (
        <ExamForm
          onExamAdded={() => setRefresh((prev) => prev + 1)}
        />
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-semibold text-blue-800">Student View</h3>
              <p className="text-sm text-blue-700">
                You can view exams and check your results here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Exam List */}
      <ExamList 
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
// components/list/AssignmentList.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Assignment {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  lesson: {
    name: string;
  };
  teacher: {
    firstName: string;
    lastName: string;
  };
  results: {
    id: number;
  }[];
  createdAt?: string;
}

interface AssignmentListProps {
  refresh: number;
}

export default function AssignmentList({ refresh }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "submitted" | "pending">("all");

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [refresh]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/assignments");
      
      if (!res.ok) {
        throw new Error("Failed to fetch assignments");
      }
      
      const data = await res.json();
      setAssignments(data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (hasResult: boolean) => {
    if (hasResult) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusLabel = (hasResult: boolean) => {
    return hasResult ? "Submitted" : "Pending";
  };

  const getStatusIcon = (hasResult: boolean) => {
    return hasResult ? "✅" : "⏳";
  };

  const filteredAssignments = assignments.filter(assignment => {
    const titleMatch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const lessonMatch = assignment.lesson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const teacherMatch = `${assignment.teacher.firstName} ${assignment.teacher.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    // Status filter
    const hasResult = assignment.results.length > 0;
    const statusMatch = filterStatus === "all" || 
      (filterStatus === "submitted" && hasResult) ||
      (filterStatus === "pending" && !hasResult);
    
    return (titleMatch || lessonMatch || teacherMatch) && statusMatch;
  });

  const calculateStats = () => {
    const total = assignments.length;
    const submitted = assignments.filter(a => a.results.length > 0).length;
    const pending = total - submitted;
    
    return { total, submitted, pending };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="mt-8">
        <div className="animate-pulse">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4 h-20"></div>
            ))}
          </div>
          
          {/* Assignments Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📝 Assignments
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {assignments.length} {assignments.length === 1 ? 'assignment' : 'assignments'}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === "ADMIN" || userRole === "TEACHER" 
              ? "Manage all assignments and track submissions" 
              : "View and submit your assignments"}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">Total Assignments</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">Submitted</div>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">Pending</div>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </div>
        </div>
      )}

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-700">
            {searchTerm || filterStatus !== "all" ? "No assignments found" : "No assignments available"}
          </h3>
          <p className="text-gray-400 mt-1">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : userRole === "ADMIN" || userRole === "TEACHER"
                ? "Create your first assignment using the form above!"
                : "Check back later for new assignments"}
          </p>
          {(searchTerm || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => {
            const hasResult = assignment.results.length > 0;
            const statusColor = getStatusColor(hasResult);
            const statusLabel = getStatusLabel(hasResult);
            const statusIcon = getStatusIcon(hasResult);
            
            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.01] overflow-hidden group"
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          📚 {assignment.lesson.name}
                        </span>
                      </div>
                    </div>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                      {statusIcon} {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  {/* Teacher */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">👨‍🏫</span>
                    <span className="text-gray-700">
                      {assignment.teacher.firstName} {assignment.teacher.lastName}
                    </span>
                  </div>

                  {/* Due Date (if available) */}
                  {assignment.dueDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">📅</span>
                      <span className="text-gray-700">
                        Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {/* Description (if available) */}
                  {assignment.description && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {assignment.description}
                    </div>
                  )}

                  {/* Submission Info */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-400">
                        {assignment.results.length} submission{assignment.results.length !== 1 ? 's' : ''}
                      </div>
                      {assignment.createdAt && (
                        <span className="text-xs text-gray-400">
                          • Created {new Date(assignment.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    {userRole === "STUDENT" && (
                      <button
                        className={`text-sm px-3 py-1 rounded-lg transition ${
                          hasResult
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        disabled={hasResult}
                      >
                        {hasResult ? "Submitted" : "Submit"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Count */}
      {filteredAssignments.length > 0 && (
        <div className="mt-6 text-sm text-gray-400 text-center">
          Showing {filteredAssignments.length} of {assignments.length} assignments
          {(searchTerm || filterStatus !== "all") && ` (filtered)`}
        </div>
      )}
    </div>
  );
}
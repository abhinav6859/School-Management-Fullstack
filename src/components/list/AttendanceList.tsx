// components/list/AttendanceList.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Attendance {
  id: number;
  date: string;
  present: boolean;
  student: {
    firstName: string;
    lastName: string;
  };
  lesson: {
    name: string;
  };
}

interface AttendanceListProps {
  refresh: number;
}

export default function AttendanceList({ refresh }: AttendanceListProps) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "present" | "absent">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [refresh]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/attendance");
      
      if (!res.ok) {
        throw new Error("Failed to fetch attendance");
      }
      
      const data = await res.json();
      setAttendance(data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (present: boolean) => {
    if (present) {
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        hover: "hover:border-green-300",
        dot: "bg-green-500",
        label: "Present",
        icon: "✅",
        cardBorder: "border-l-4 border-l-green-500"
      };
    }
    return {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      hover: "hover:border-red-300",
      dot: "bg-red-500",
      label: "Absent",
      icon: "❌",
      cardBorder: "border-l-4 border-l-red-500"
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const filteredAttendance = attendance
    .filter(item => {
      const studentName = `${item.student.firstName} ${item.student.lastName}`.toLowerCase();
      const lessonName = item.lesson.name.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      const nameMatch = studentName.includes(search) || lessonName.includes(search);
      const statusMatch = filterStatus === "all" || 
        (filterStatus === "present" && item.present) ||
        (filterStatus === "absent" && !item.present);
      
      return nameMatch && statusMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.present).length;
    const absent = total - present;
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, presentPercentage };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="mt-8">
        <div className="animate-pulse">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4 h-20"></div>
            ))}
          </div>
          
          {/* Controls Skeleton */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
          
          {/* Attendance Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
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
            📊 Attendance Records
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {attendance.length} {attendance.length === 1 ? 'record' : 'records'}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === "ADMIN" || userRole === "TEACHER" 
              ? "View and manage all attendance records" 
              : "Track your attendance history"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student or lesson..."
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
            <option value="present">✅ Present</option>
            <option value="absent">❌ Absent</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-sm">
            <div className="text-sm opacity-80">Total Records</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-sm">
            <div className="text-sm opacity-80">Present</div>
            <div className="text-2xl font-bold">{stats.present}</div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white shadow-sm">
            <div className="text-sm opacity-80">Absent</div>
            <div className="text-2xl font-bold">{stats.absent}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-sm">
            <div className="text-sm opacity-80">Attendance Rate</div>
            <div className="text-2xl font-bold">{stats.presentPercentage}%</div>
          </div>
        </div>
      )}

      {/* Attendance Grid */}
      {filteredAttendance.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700">
            {searchTerm || filterStatus !== "all" ? "No records found" : "No attendance records"}
          </h3>
          <p className="text-gray-400 mt-1">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Attendance records will appear here once recorded"}
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
          {filteredAttendance.map((item) => {
            const status = getStatusStyles(item.present);
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border ${status.border} ${status.hover} hover:shadow-md transition-all duration-200 overflow-hidden group ${status.cardBorder}`}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${status.bg} ${status.text}`}>
                        {getInitials(item.student.firstName, item.student.lastName)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {item.student.firstName} {item.student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.lesson.name}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.text} ${status.border}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">📅</span>
                      <span className="text-gray-700 font-medium">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">⏰</span>
                      <span className="text-gray-500">
                        {getTimeAgo(item.date)}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.dot} ${item.present ? 'animate-pulse' : ''}`}></div>
                      <span className="text-xs text-gray-400">
                        Record #{item.id}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {item.present ? 'Student was present' : 'Student was absent'}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                  item.present ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Count */}
      {filteredAttendance.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-400">
          <span>
            Showing {filteredAttendance.length} of {attendance.length} records
            {(searchTerm || filterStatus !== "all") && ` (filtered)`}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Present: {attendance.filter(a => a.present).length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Absent: {attendance.filter(a => !a.present).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  UserIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingOfficeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface ClassItem {
  id: number;
  name: string;
  capacity: number;
  grade: {
    level: number;
  };
  supervisor?: {
    firstName: string;
    lastName: string;
  };
  students: {
    firstName: string;
    lastName: string;
  }[];
}

export default function ClassList({
  refresh,
}: {
  refresh: number;
}) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<number | "all">("all");
  const [expandedClass, setExpandedClass] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [refresh]);

  // Get unique grades for filter
  const uniqueGrades = Array.from(new Set(classes.map(cls => cls.grade.level))).sort();
  
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.supervisor && `${cls.supervisor.firstName} ${cls.supervisor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGrade = selectedGrade === "all" || cls.grade.level === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const calculateOccupancy = (capacity: number, studentsCount: number) => {
    return (studentsCount / capacity) * 100;
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "from-red-500 to-red-600";
    if (percentage >= 70) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  const getOccupancyTextColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const toggleExpand = (classId: number) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Class Management
            </h2>
          </div>
          <p className="text-gray-600 ml-12">
            Manage all classes, track occupancy, and monitor class performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((acc, cls) => acc + cls.students.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Occupancy</p>
                <p className={`text-2xl font-bold ${getOccupancyTextColor(
                  classes.reduce((acc, cls) => 
                    acc + (cls.students.length / cls.capacity) * 100, 0) / classes.length
                )}`}>
                  {Math.round(classes.reduce((acc, cls) => 
                    acc + (cls.students.length / cls.capacity) * 100, 0) / (classes.length || 1))}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((acc, cls) => acc + cls.capacity, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by class name or supervisor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm"
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === "all" ? "all" : parseInt(e.target.value))}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Grades</option>
              {uniqueGrades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading classes...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredClasses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <BuildingOfficeIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedGrade !== "all" ? "Try adjusting your filters" : "No classes available"}
            </p>
          </div>
        )}

        {/* Classes Grid */}
        {!isLoading && filteredClasses.length > 0 && (
          <div className="grid gap-5">
            {filteredClasses.map((cls, index) => {
              const occupancyPercentage = calculateOccupancy(cls.capacity, cls.students.length);
              const occupancyColor = getOccupancyColor(occupancyPercentage);
              const isFull = cls.students.length >= cls.capacity;
              
              return (
                <div
                  key={cls.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        {/* Class Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-sm">
                            <AcademicCapIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-bold text-gray-900">
                                {cls.name}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                                Grade {cls.grade.level}
                              </span>
                              {isFull && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Full
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Class Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">Students</span>
                                <span className="text-sm font-semibold">
                                  {cls.students.length} / {cls.capacity}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full bg-gradient-to-r ${occupancyColor} transition-all duration-500`}
                                  style={{ width: `${occupancyPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <UserIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">
                              <strong className="font-semibold">Supervisor:</strong>{" "}
                              {cls.supervisor
                                ? `${cls.supervisor.firstName} ${cls.supervisor.lastName}`
                                : "Not assigned"}
                            </span>
                          </div>
                        </div>

                        {/* Students Section - Collapsible */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => toggleExpand(cls.id)}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-cyan-600 transition-colors group/students"
                          >
                            <UsersIcon className="w-4 h-4" />
                            <span>View Students ({cls.students.length})</span>
                            {expandedClass === cls.id ? (
                              <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                              <ChevronDownIcon className="w-4 h-4" />
                            )}
                          </button>

                          {/* Students List */}
                          {expandedClass === cls.id && (
                            <div className="mt-3 animate-slideDown">
                              {cls.students.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {cls.students.slice(0, 20).map((student, idx) => (
                                    <div
                                      key={`${student.firstName}-${student.lastName}-${idx}`}
                                      className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-cyan-50 rounded-lg hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 group/student"
                                    >
                                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-xs font-bold text-white">
                                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">
                                          {student.firstName} {student.lastName}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {cls.students.length > 20 && (
                                    <div className="col-span-full text-center text-sm text-gray-500 mt-2 py-2 bg-gray-50 rounded-lg">
                                      +{cls.students.length - 20} more students
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                  <UsersIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500">No students enrolled yet</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Capacity Ring */}
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="44"
                              stroke="#e5e7eb"
                              strokeWidth="6"
                              fill="none"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="44"
                              stroke="url(#gradient)"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 44}`}
                              strokeDashoffset={`${2 * Math.PI * 44 * (1 - occupancyPercentage / 100)}`}
                              className="transition-all duration-700"
                            />
                          </svg>
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#06b6d4" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-900">
                              {Math.round(occupancyPercentage)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="h-1 bg-gray-100">
                    <div 
                      className={`h-full bg-gradient-to-r ${occupancyColor} transition-all duration-500`}
                      style={{ width: `${occupancyPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
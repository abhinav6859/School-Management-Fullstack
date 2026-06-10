"use client";

import { useEffect, useState } from "react";
import { 
  BookOpenIcon, 
  CalendarIcon, 
  UserGroupIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  ClockIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface Lesson {
  id: number;
  name: string;
  day: string;
  subject: {
    name: string;
  };
  class: {
    name: string;
  };
  teacher: {
    firstName: string;
    lastName: string;
  };
  exams: {
    id: number;
  }[];
  assignments: {
    id: number;
  }[];
}

export default function LessonList({
  refresh,
}: {
  refresh: number;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lessons");
      const data = await res.json();
      setLessons(data);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [refresh]);

  // Get unique days for filter
  const uniqueDays = Array.from(new Set(lessons.map(lesson => lesson.day)));

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.class.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${lesson.teacher.firstName} ${lesson.teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === "all" || lesson.day === selectedDay;
    return matchesSearch && matchesDay;
  });

  const getDayColor = (day: string) => {
    const colors: { [key: string]: string } = {
      "MONDAY": "from-orange-500 to-red-500",
      "TUESDAY": "from-red-500 to-pink-500",
      "WEDNESDAY": "from-pink-500 to-purple-500",
      "THURSDAY": "from-purple-500 to-indigo-500",
      "FRIDAY": "from-indigo-500 to-blue-500",
    };
    return colors[day] || "from-gray-500 to-gray-600";
  };

  const getDayBgColor = (day: string) => {
    const colors: { [key: string]: string } = {
      "MONDAY": "bg-orange-100 text-orange-800",
      "TUESDAY": "bg-red-100 text-red-800",
      "WEDNESDAY": "bg-pink-100 text-pink-800",
      "THURSDAY": "bg-purple-100 text-purple-800",
      "FRIDAY": "bg-indigo-100 text-indigo-800",
    };
    return colors[day] || "bg-gray-100 text-gray-800";
  };

  const toggleExpand = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Lesson Management
            </h2>
          </div>
          <p className="text-gray-600 ml-12">
            Manage all lessons, track schedules, and monitor academic activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.reduce((acc, lesson) => acc + lesson.exams.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.reduce((acc, lesson) => acc + lesson.assignments.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <PencilSquareIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(lessons.map(l => l.subject.name)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(lessons.map(l => l.class.name)).size}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
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
              placeholder="Search by lesson, subject, class, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
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

          {/* Day Filter */}
          <div className="relative">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Days</option>
              {uniqueDays.map(day => (
                <option key={day} value={day}>
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </option>
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading lessons...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredLessons.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <BookOpenIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedDay !== "all" ? "Try adjusting your filters" : "No lessons available"}
            </p>
          </div>
        )}

        {/* Lessons Grid */}
        {!isLoading && filteredLessons.length > 0 && (
          <div className="grid gap-5">
            {filteredLessons.map((lesson, index) => {
              const dayColor = getDayColor(lesson.day);
              const dayBgColor = getDayBgColor(lesson.day);
              
              return (
                <div
                  key={lesson.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className="relative">
                    {/* Day Indicator Bar */}
                    <div className={`h-2 bg-gradient-to-r ${dayColor}`} />
                    
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          {/* Lesson Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 bg-gradient-to-br ${dayColor} rounded-xl shadow-sm`}>
                              <CalendarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {lesson.name}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dayBgColor}`}>
                                  {lesson.day.charAt(0) + lesson.day.slice(1).toLowerCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Lesson Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <AcademicCapIcon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">
                                <strong className="font-semibold">Subject:</strong>{" "}
                                {lesson.subject.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">
                                <strong className="font-semibold">Class:</strong>{" "}
                                {lesson.class.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">
                                <strong className="font-semibold">Teacher:</strong>{" "}
                                {lesson.teacher.firstName} {lesson.teacher.lastName}
                              </span>
                            </div>
                          </div>

                          {/* Academic Activities Section */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => toggleExpand(lesson.id)}
                              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors group/activities"
                            >
                              <ClipboardDocumentListIcon className="w-4 h-4" />
                              <span>Academic Activities</span>
                              {expandedLesson === lesson.id ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              )}
                            </button>

                            {/* Activities Details */}
                            {expandedLesson === lesson.id && (
                              <div className="mt-3 animate-slideDown">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {/* Exams Section */}
                                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <ClipboardDocumentListIcon className="w-4 h-4 text-red-600" />
                                      <h4 className="text-sm font-semibold text-red-800">Exams</h4>
                                    </div>
                                    <p className="text-2xl font-bold text-red-600">
                                      {lesson.exams.length}
                                    </p>
                                    <p className="text-xs text-red-600 mt-1">
                                      Total exams scheduled
                                    </p>
                                  </div>

                                  {/* Assignments Section */}
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <PencilSquareIcon className="w-4 h-4 text-green-600" />
                                      <h4 className="text-sm font-semibold text-green-800">Assignments</h4>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">
                                      {lesson.assignments.length}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                      Total assignments given
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Day Schedule Card */}
                        <div className="flex-shrink-0">
                          <div className={`bg-gradient-to-br ${dayColor} rounded-xl p-4 text-white shadow-lg min-w-[120px] text-center`}>
                            <ClockIcon className="w-6 h-6 mx-auto mb-2 opacity-90" />
                            <p className="text-xs font-medium opacity-90">Schedule</p>
                            <p className="text-sm font-bold mt-1">
                              {lesson.day.charAt(0) + lesson.day.slice(1).toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <AcademicCapIcon className="w-3 h-3" />
                        Lesson ID: {lesson.id}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpand(lesson.id)}
                      className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      {expandedLesson === lesson.id ? "Show Less" : "View Activities"}
                    </button>
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
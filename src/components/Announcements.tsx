// components/Announcements.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  classId?: number | null;
  class?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AnnouncementsProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
  showClassFilter?: boolean;
}

const Announcements = ({ 
  limit = 3, 
  showViewAll = true, 
  className = "",
  showClassFilter = false 
}: AnnouncementsProps) => {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/announcements");
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch announcements");
      }
      
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setError(error instanceof Error ? error.message : "Failed to load announcements");
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const getClassColor = (classId?: number | null) => {
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-green-100 text-green-700 border-green-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-pink-100 text-pink-700 border-pink-200",
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-teal-100 text-teal-700 border-teal-200",
    ];
    return classId ? colors[classId % colors.length] : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewAll = () => {
    router.push("/list/announcements");
  };

  const handleAnnouncementClick = (id: number) => {
    router.push(`/list/announcements/${id}`);
  };

  const filteredAnnouncements = selectedClass === "all" 
    ? announcements 
    : announcements.filter(a => a.classId === parseInt(selectedClass));

  const displayedAnnouncements = filteredAnnouncements.slice(0, limit);

  // Get unique classes for filter
  const uniqueClasses = announcements
    .filter(a => a.class)
    .map(a => a.class!)
    .filter((classItem, index, self) => 
      self.findIndex(c => c.id === classItem.id) === index
    );

  if (loading) {
    return (
      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-gray-500 text-sm">Failed to load announcements</p>
          <button
            onClick={fetchAnnouncements}
            className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
          {showViewAll && (
            <button
              onClick={handleViewAll}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium transition"
            >
              View All
            </button>
          )}
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500 text-sm">No announcements yet</p>
          <p className="text-gray-400 text-xs mt-1">Check back later for updates</p>
        </div>
      </div>
    );
  }

  if (displayedAnnouncements.length === 0 && selectedClass !== "all") {
    return (
      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
          {showViewAll && (
            <button
              onClick={handleViewAll}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium transition"
            >
              View All
            </button>
          )}
        </div>
        {showClassFilter && uniqueClasses.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedClass("all")}
              className={`px-3 py-1 text-xs rounded-full transition ${
                selectedClass === "all"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Classes
            </button>
            {uniqueClasses.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => setSelectedClass(classItem.id.toString())}
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedClass === classItem.id.toString()
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {classItem.name}
              </button>
            ))}
          </div>
        )}
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-sm">No announcements for this class</p>
          <button
            onClick={() => setSelectedClass("all")}
            className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            View all announcements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
            {filteredAnnouncements.length}
          </span>
        </div>
        {showViewAll && (
          <button
            onClick={handleViewAll}
            className="text-xs text-blue-500 hover:text-blue-600 font-medium transition hover:underline"
          >
            View All →
          </button>
        )}
      </div>

      {/* Class Filter */}
      {showClassFilter && uniqueClasses.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedClass("all")}
            className={`px-3 py-1 text-xs rounded-full transition ${
              selectedClass === "all"
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Classes
          </button>
          {uniqueClasses.map((classItem) => (
            <button
              key={classItem.id}
              onClick={() => setSelectedClass(classItem.id.toString())}
              className={`px-3 py-1 text-xs rounded-full transition ${
                selectedClass === classItem.id.toString()
                  ? "bg-purple-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {classItem.name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {displayedAnnouncements.map((announcement) => {
          const isRecent = new Date(announcement.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          
          return (
            <div
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement.id)}
              className={`
                rounded-xl p-4 cursor-pointer transition-all duration-200
                hover:shadow-md hover:scale-[1.01]
                bg-gradient-to-r from-gray-50 to-white
                border border-gray-100
                ${isRecent ? 'border-l-4 border-l-purple-500' : ''}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="font-semibold text-gray-900">
                      {announcement.title}
                    </h2>
                    {announcement.class && (
                      <span className={`
                        text-[10px] font-medium px-2 py-0.5 rounded-full
                        ${getClassColor(announcement.classId)}
                      `}>
                        {announcement.class.name}
                      </span>
                    )}
                    {isRecent && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {announcement.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(announcement.date)}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {getFullDate(announcement.date)}
                    </span>
                  </div>
                </div>
                
                {/* Arrow Indicator */}
                <div className="flex-shrink-0 text-gray-300 group-hover:text-purple-500 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {filteredAnnouncements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>
            Showing {Math.min(limit, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
          </span>
          {announcements.some(a => new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) && (
            <span className="text-purple-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              New announcements available
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;
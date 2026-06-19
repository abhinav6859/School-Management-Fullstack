// components/list/ResultList.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Result {
  id: number;
  score: number;
  student: {
    firstName: string;
    lastName: string;
  };
  exam?: {
    title: string;
  };
  assignment?: {
    title: string;
  };
  createdAt?: string;
}

interface ResultListProps {
  refresh: number;
}

export default function ResultList({ refresh }: ResultListProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchResults();
  }, [refresh]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/results");
      
      if (!res.ok) {
        throw new Error("Failed to fetch results");
      }
      
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 75) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🌟";
    if (score >= 75) return "⭐";
    if (score >= 60) return "✅";
    if (score >= 40) return "📖";
    return "📚";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Average";
    if (score >= 40) return "Needs Improvement";
    return "Needs Attention";
  };

  const filteredResults = results.filter(result => {
    const studentName = `${result.student.firstName} ${result.student.lastName}`.toLowerCase();
    const examTitle = result.exam?.title?.toLowerCase() || "";
    const assignmentTitle = result.assignment?.title?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    
    return studentName.includes(search) || 
           examTitle.includes(search) || 
           assignmentTitle.includes(search);
  });

  const calculateStats = () => {
    if (results.length === 0) return null;
    
    const scores = results.map(r => r.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    
    return { average, highest, lowest };
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
          
          {/* Results Skeleton */}
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
            📊 Results
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === "ADMIN" || userRole === "TEACHER" 
              ? "View all student results and performance" 
              : "Track your academic performance"}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">Average Score</div>
            <div className="text-2xl font-bold">{stats.average.toFixed(1)}%</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">Highest Score</div>
            <div className="text-2xl font-bold">{stats.highest}%</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">Lowest Score</div>
            <div className="text-2xl font-bold">{stats.lowest}%</div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-700">
            {searchTerm ? "No results found" : "No results available"}
          </h3>
          <p className="text-gray-400 mt-1">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : userRole === "ADMIN" || userRole === "TEACHER"
                ? "Results will appear here once published"
                : "Check back later for your results"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredResults.map((result) => {
            const scoreColor = getScoreColor(result.score);
            const scoreEmoji = getScoreEmoji(result.score);
            const scoreLabel = getScoreLabel(result.score);
            
            return (
              <div
                key={result.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02] overflow-hidden group"
              >
                {/* Score Header */}
                <div className={`p-4 border-b ${scoreColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{scoreEmoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {result.student.firstName} {result.student.lastName}
                        </div>
                        <div className="text-xs opacity-75">{scoreLabel}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{result.score}%</div>
                    </div>
                  </div>
                </div>

                {/* Result Details */}
                <div className="p-4 space-y-3">
                  {/* Exam */}
                  {result.exam && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 text-sm">📝</span>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Exam
                        </div>
                        <div className="text-sm text-gray-800 font-medium">
                          {result.exam.title}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assignment */}
                  {result.assignment && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 text-sm">📄</span>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Assignment
                        </div>
                        <div className="text-sm text-gray-800 font-medium">
                          {result.assignment.title}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Score Badge */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${scoreColor.split(' ')[0]}`}></div>
                      <span className="text-xs text-gray-500">
                        {result.createdAt 
                          ? new Date(result.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Recent'}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${scoreColor}`}>
                      {scoreLabel}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Result Count */}
      {filteredResults.length > 0 && (
        <div className="mt-6 text-sm text-gray-400 text-center">
          Showing {filteredResults.length} of {results.length} results
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </div>
      )}
    </div>
  );
}
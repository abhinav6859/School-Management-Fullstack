"use client";

import { useEffect, useState } from "react";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Parent {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  students: Student[];
}

export default function ParentList({
  refresh,
}: {
  refresh: number;
}) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchParents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/parents");
      const data = await res.json();
      setParents(data);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [refresh]);

  const filteredParents = parents.filter(parent => 
    `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone.includes(searchTerm)
  );

  const toggleExpand = (parentId: string) => {
    setExpandedParent(expandedParent === parentId ? null : parentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Parent Management
            </h2>
          </div>
          <p className="text-gray-600 ml-12">
            Manage all parents and their children&apos;s information
          </p>
        </div>

        {/* Stats and Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Search Bar */}
          <div className="lg:col-span-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
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
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Parents</p>
                <p className="text-2xl font-bold text-gray-900">{parents.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading parents...</p>
          </div>
        )}

        {/* Parents Grid */}
        {!isLoading && filteredParents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <UserGroupIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No parents found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try a different search term" : "No parents registered yet"}
            </p>
          </div>
        )}

        {/* Parents List */}
        {!isLoading && filteredParents.length > 0 && (
          <div className="grid gap-5">
            {filteredParents.map((parent, index) => (
              <div
                key={parent.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Header Section */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      {/* Parent Name and Badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-sm">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {parent.firstName} {parent.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">@{parent.username}</p>
                        </div>
                        <div className="ml-auto lg:ml-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Contact Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                          <a href={`mailto:${parent.email}`} className="text-sm hover:text-indigo-600 transition-colors truncate">
                            {parent.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                          <a href={`tel:${parent.phone}`} className="text-sm hover:text-indigo-600 transition-colors">
                            {parent.phone}
                          </a>
                        </div>
                        {parent.address && (
                          <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{parent.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Children Section */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => toggleExpand(parent.id)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors group/children"
                        >
                          <AcademicCapIcon className="w-4 h-4" />
                          <span>Children ({parent.students.length})</span>
                          {expandedParent === parent.id ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </button>

                        {/* Students List - Collapsible */}
                        {expandedParent === parent.id && (
                          <div className="mt-3 animate-slideDown">
                            {parent.students.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {parent.students.map((student) => (
                                  <div
                                    key={student.id}
                                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                                  >
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-semibold text-indigo-600">
                                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                      </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {student.firstName} {student.lastName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">No students registered</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 lg:flex-col">
                      <button
                        onClick={() => window.location.href = `mailto:${parent.email}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group/email"
                        title="Send Email"
                      >
                        <EnvelopeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => window.location.href = `tel:${parent.phone}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Call Parent"
                      >
                        <PhoneIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="h-1 bg-gray-100">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${(parent.students.length / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
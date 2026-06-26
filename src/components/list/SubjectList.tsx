"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Subject {
  id: number;
  name: string;
  teachers: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
  lessons: {
    id: number;
  }[];
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

export default function SubjectList({
  refresh,
}: {
  refresh: number;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      if (res.ok) {
        setSubjects(data);
      } else {
        toast.error(data.message || "Failed to fetch subjects");
      }
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  };

 const fetchTeachers = async () => {
  try {
    const res = await fetch("/api/teachers");

    if (!res.ok) {
      throw new Error("Failed to fetch teachers");
    }

    const response = await res.json();

    if (response.success && Array.isArray(response.data)) {
      setTeachers(response.data);
    } else {
      setTeachers([]);
      console.error("Invalid response:", response);
    }
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    setTeachers([]);
  }
};

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, [refresh]);

  const handleDelete = async (subjectId: number, teacherCount: number) => {
    if (teacherCount > 0) {
      toast.error("Teacher present in this subject so remove first");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this subject?");
    if (!confirm) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/subjects?id=${subjectId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Subject deleted successfully");
        fetchSubjects();
      } else {
        toast.error(data.message || "Failed to delete subject");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setSelectedTeachers(subject.teachers.map(t => t.id));
  };

  const handleUpdate = async () => {
    if (!editingSubject) return;

    if (!editName.trim()) {
      toast.error("Subject name is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingSubject.id,
          name: editName.trim(),
          teacherIds: selectedTeachers,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Subject updated successfully");
        setEditingSubject(null);
        setEditName("");
        setSelectedTeachers([]);
        fetchSubjects();
      } else {
        toast.error(data.message || "Failed to update subject");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSubject(null);
    setEditName("");
    setSelectedTeachers([]);
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Subject Management
            </h2>
          </div>
          <p className="text-gray-600 ml-12">
            Manage all subjects and their teacher assignments
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.reduce((acc, sub) => acc + sub.teachers.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Edit Subject
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter subject name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign Teachers
                </label>
                <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto">
                  {teachers.map((teacher) => (
                    <label
                      key={teacher.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher.id)}
                        onChange={() => {
                          if (selectedTeachers.includes(teacher.id)) {
                            setSelectedTeachers(selectedTeachers.filter(id => id !== teacher.id));
                          } else {
                            setSelectedTeachers([...selectedTeachers, teacher.id]);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        {teacher.firstName} {teacher.lastName}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select multiple teachers as needed
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 transition-all duration-200 font-semibold shadow-sm"
                >
                  {isLoading ? "Updating..." : "Update Subject"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subjects Grid */}
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <BookOpenIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No subjects found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try a different search term" : "Create a new subject to get started"}
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredSubjects.map((subject, index) => (
              <div
                key={subject.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-sm">
                          <BookOpenIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {subject.name}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <ClockIcon className="w-4 h-4" />
                          <span className="text-sm">
                            <strong className="font-semibold">Total Lessons:</strong> {subject.lessons.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserGroupIcon className="w-4 h-4" />
                          <span className="text-sm">
                            <strong className="font-semibold">Teachers:</strong> {subject.teachers.length}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AcademicCapIcon className="w-4 h-4 text-gray-600" />
                          <strong className="text-sm font-semibold text-gray-700">Assigned Teachers:</strong>
                        </div>
                        {subject.teachers.length > 0 ? (
                          <div className="flex flex-wrap gap-2 ml-6">
                            {subject.teachers.map((teacher) => (
                              <span
                                key={teacher.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700"
                              >
                                {teacher.firstName} {teacher.lastName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic text-sm ml-6">No teachers assigned</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(subject)}
                        disabled={isLoading}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 group/edit"
                        title="Edit subject"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id, subject.teachers.length)}
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 group/delete"
                        title="Delete subject"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1 bg-gray-100">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${(subject.teachers.length / Math.max(teachers.length, 1)) * 100}%` }}
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
      `}</style>
    </div>
  );
}
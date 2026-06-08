"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { role } from "@/lib/data";
import { useToast } from "@/components/ToastProvider";
import FormModal from "@/components/FormModal";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  sex: string;
  photo?: string;
  phone?: string | null;
  address?: string | null;
  parent: {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  class: {
    id?: string;
    name: string;
    section?: string;
  };
  grade: {
    level: number;
    section?: string;
  };
  attendance?: number;
  averageGrade?: number;
  enrollmentDate?: string;
}

interface FilterOptions {
  searchTerm: string;
  grade: string;
  class: string;
  sex: string;
}

type SortField = "name" | "grade";
type SortOrder = "asc" | "desc";

interface ActiveModal {
  type: "update" | "delete";
  student: Student;
}

interface StudentListProps {
  refresh?: number;
  onStudentClick?: (student: Student) => void;
  showActions?: boolean;
}

export default function StudentList({
  refresh = 0,
  onStudentClick,
  showActions = true,
}: StudentListProps) {
  const { showToast } = useToast();

  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    grade: "",
    class: "",
    sex: "",
  });

  // Sorting
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/students");

      if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);

      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refresh]);

  // Listen for student CRUD events
  useEffect(() => {
    const handleStudentChange = () => {
      fetchStudents();
      showToast("Student list has been updated", "success");
    };

    window.addEventListener("studentCreated", handleStudentChange);
    window.addEventListener("studentUpdated", handleStudentChange);
    window.addEventListener("studentDeleted", handleStudentChange);

    return () => {
      window.removeEventListener("studentCreated", handleStudentChange);
      window.removeEventListener("studentUpdated", handleStudentChange);
      window.removeEventListener("studentDeleted", handleStudentChange);
    };
  }, []);

  // Handlers
  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ searchTerm: "", grade: "", class: "", sex: "" });
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleModalSuccess = () => {
    fetchStudents();
    setActiveModal(null);
    setSelectedStudent(null);
    showToast("Operation completed successfully", "success");
  };

  const handleModalError = (errorMsg: string) => {
    showToast(errorMsg || "Operation failed", "error");
  };

  // Filter options
  const filterOptions = useMemo(() => {
    const grades = new Set<number>();
    const classes = new Set<string>();
    const sexes = new Set<string>();

    students.forEach(s => {
      if (s.grade?.level) grades.add(s.grade.level);
      if (s.class?.name) classes.add(s.class.name);
      if (s.sex) sexes.add(s.sex);
    });

    return {
      grades: Array.from(grades).sort((a, b) => a - b),
      classes: Array.from(classes).sort(),
      sexes: Array.from(sexes),
    };
  }, [students]);

  // Filter and sort students
  const processedStudents = useMemo(() => {
    let filtered = [...students];

    if (filters.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.firstName?.toLowerCase().includes(q) ||
        s.lastName?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.username?.toLowerCase().includes(q) ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
      );
    }

    if (filters.grade) {
      filtered = filtered.filter(s => s.grade?.level?.toString() === filters.grade);
    }

    if (filters.class) {
      filtered = filtered.filter(s => s.class?.name?.toLowerCase().includes(filters.class.toLowerCase()));
    }

    if (filters.sex) {
      filtered = filtered.filter(s => s.sex === filters.sex);
    }

    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (sortField === "name") {
        aVal = `${a.firstName || ''} ${a.lastName || ''}`;
        bVal = `${b.firstName || ''} ${b.lastName || ''}`;
      } else {
        aVal = a.grade?.level ?? 0;
        bVal = b.grade?.level ?? 0;
      }

      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [students, filters, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [processedStudents, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // Student Card Component
  const StudentCard = ({ student }: { student: Student }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group relative">
      <div
        className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer"
        onClick={() => {
          setSelectedStudent(student);
          onStudentClick?.(student);
        }}
      >
        <div className="absolute -bottom-12 left-4">
          <div className="relative">
            <Image
              src={student.photo || "/avatar.png"}
              alt={`${student.firstName} ${student.lastName}`}
              width={80}
              height={80}
              className="rounded-full border-4 border-white bg-white object-cover w-20 h-20"
            />
            {student.attendance !== undefined && student.attendance >= 90 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" title="Excellent Attendance" />
            )}
          </div>
        </div>

        {showActions && role === "admin" && (
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal({ type: "update", student });
              }}
              className="p-1.5 bg-white/90 hover:bg-blue-50 rounded-lg shadow-sm transition-colors"
              title="Edit Student"
            >
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal({ type: "delete", student });
              }}
              className="p-1.5 bg-white/90 hover:bg-red-50 rounded-lg shadow-sm transition-colors"
              title="Delete Student"
            >
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div
        className="pt-14 p-4 cursor-pointer"
        onClick={() => {
          setSelectedStudent(student);
          onStudentClick?.(student);
        }}
      >
        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
          {student.firstName} {student.lastName}
        </h3>

        <div className="mt-2 space-y-1.5 text-sm">
          <p className="text-gray-600 flex items-center gap-2">
            <span className="text-gray-400">📧</span>
            <span className="truncate">{student.email}</span>
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="text-gray-400">👤</span>
            <span>@{student.username}</span>
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="text-gray-400">📚</span>
            <span>Grade {student.grade?.level || 'N/A'} • {student.class?.name || 'N/A'}</span>
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="text-gray-400">👪</span>
            <span>{student.parent?.firstName || ''} {student.parent?.lastName || ''}</span>
          </p>
        </div>

        {student.averageGrade !== undefined && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Grade</span>
              <span className={`font-semibold ${
                student.averageGrade >= 90 ? "text-green-600" :
                student.averageGrade >= 75 ? "text-blue-600" :
                student.averageGrade >= 60 ? "text-yellow-600" : "text-red-600"
              }`}>
                {student.averageGrade}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchStudents} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Student List
              <span className="ml-2 text-sm font-normal text-gray-500">({processedStudents.length} students)</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage and view all student information</p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={filters.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {showActions && role === "admin" && (
              <FormModal
                table="student"
                type="create"
                onSuccess={handleModalSuccess}
                onError={handleModalError}
              />
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <select
            value={filters.grade}
            onChange={(e) => handleFilterChange("grade", e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Grades</option>
            {filterOptions.grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>

          <select
            value={filters.class}
            onChange={(e) => handleFilterChange("class", e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Classes</option>
            {filterOptions.classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.sex}
            onChange={(e) => handleFilterChange("sex", e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          {(filters.grade || filters.class || filters.sex || filters.searchTerm) && (
            <button onClick={clearFilters} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium">
              Clear All
            </button>
          )}

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleSort("name")}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                sortField === "name" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("grade")}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                sortField === "grade" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Grade {sortField === "grade" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {processedStudents.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="mt-2 text-gray-500">No students found matching your criteria.</p>
          <button onClick={clearFilters} className="mt-2 text-purple-600 hover:text-purple-700 font-medium">
            Clear filters
          </button>
        </div>
      )}

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-gray-600 text-sm">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Student Details</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={selectedStudent.photo || "/avatar.png"}
                  alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="text-2xl font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                  <p className="text-gray-600">@{selectedStudent.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Email" value={selectedStudent.email} />
                <DetailItem label="Gender" value={selectedStudent.sex} />
                <DetailItem label="Grade" value={`Grade ${selectedStudent.grade?.level || 'N/A'}`} />
                <DetailItem label="Class" value={selectedStudent.class?.name || 'N/A'} />
                <DetailItem label="Parent" value={`${selectedStudent.parent?.firstName || ''} ${selectedStudent.parent?.lastName || ''}`} />
                {selectedStudent.parent?.email && <DetailItem label="Parent Email" value={selectedStudent.parent.email} />}
                {selectedStudent.parent?.phone && <DetailItem label="Parent Phone" value={selectedStudent.parent.phone} />}
                {selectedStudent.phone && <DetailItem label="Phone" value={selectedStudent.phone} />}
                {selectedStudent.address && <DetailItem label="Address" value={selectedStudent.address} />}
                {selectedStudent.enrollmentDate && (
                  <DetailItem label="Enrollment Date" value={new Date(selectedStudent.enrollmentDate).toLocaleDateString()} />
                )}
              </div>

              {showActions && role === "admin" && (
                <div className="mt-6 pt-4 border-t flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setActiveModal({ type: "update", student: selectedStudent });
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal({ type: "delete", student: selectedStudent });
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {activeModal?.type === "update" && (
        <FormModal
          table="student"
          type="update"
          data={activeModal.student}
          defaultOpen={true}
          hideTrigger={true}
          onSuccess={handleModalSuccess}
          onError={handleModalError}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Delete Modal */}
      {activeModal?.type === "delete" && (
        <FormModal
          table="student"
          type="delete"
          id={activeModal.student.id}
          defaultOpen={true}
          hideTrigger={true}
          onSuccess={handleModalSuccess}
          onError={handleModalError}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || '—'}</p>
    </div>
  );
}
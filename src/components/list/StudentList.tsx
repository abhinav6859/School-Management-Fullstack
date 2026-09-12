"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { role } from "@/lib/data";
import { useToast } from "@/components/ToastProvider";
import FormModal from "@/components/FormModal";
import StudentCard from "../students/Card";
import { Student } from "@/types/student";
import {FilterOptions, SortField, SortOrder ,ActiveModal} from "../../types/student";
import StudentFilters from "../students/Filter";
import StudentHeader from "../students/Header";


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
      <StudentHeader
        studentcount={processedStudents.length}
      searchTerm={filters.searchTerm}
      onSearch={handleSearch}
      handlesuccess={handleModalSuccess}
      handleerror={handleModalError}
        showActions={showActions}
          role={role}
      />

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
          <StudentCard key={student.id} student={student} 
          onStudentClick={setSelectedStudent}
            onEditClick={(s) => setActiveModal({ type: "update", student: s })}
            onDeleteClick={(s) => setActiveModal({ type: "delete", student: s })}
            showActions={showActions}
            role={role}
          />
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
                  src={selectedStudent.img || "/avatar.png"}
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
                {selectedStudent.createdAt && (
                  <DetailItem label="Enrollment Date" value={new Date(selectedStudent.createdAt).toLocaleDateString()} />
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

function DetailItem({ label, value }: { label: string;   value?: string | null}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value ?? "—"}</p>
    </div>
  );
}
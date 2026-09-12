"use client";

import Image from "next/image";

import { Student } from "@/types/student";

interface StudentCardProps {
  student: Student;
  onStudentClick?: (student: Student) => void;
  onEditClick?: (student: Student) => void;
  onDeleteClick?: (student: Student) => void;
  showActions?: boolean;
  role?: string;
}

export default function StudentCard({
  student,
  onStudentClick,
  onEditClick,
  onDeleteClick,
  showActions = false,
  role = "",
}: StudentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group relative">
      {/* Header with background gradient */}
      <div
        className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer"
        onClick={() => onStudentClick?.(student)}
      >
        <div className="absolute -bottom-12 left-4">
          <div className="relative">
            <Image
              src={student.img || "/avatar.png"}
              alt={`${student.firstName} ${student.lastName}`}
              width={80}
              height={80}
              className="rounded-full border-4 border-white bg-white object-cover w-20 h-20"
            />
            {/* {student.attendance !== undefined && student.attendance >= 90 && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                title="Excellent Attendance"
              />
            )} */}
          </div>
        </div>

        {/* Action buttons (Edit / Delete) – only if showActions and admin */}
        {showActions && role === "admin" && (
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick?.(student);
              }}
              className="p-1.5 bg-white/90 hover:bg-blue-50 rounded-lg shadow-sm transition-colors"
              title="Edit Student"
            >
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick?.(student);
              }}
              className="p-1.5 bg-white/90 hover:bg-red-50 rounded-lg shadow-sm transition-colors"
              title="Delete Student"
            >
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Body – clickable to view details */}
      <div
        className="pt-14 p-4 cursor-pointer"
        onClick={() => onStudentClick?.(student)}
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
            <span>
              Grade {student.grade?.level || "N/A"} •{" "}
              {student.class?.name || "N/A"}
            </span>
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="text-gray-400">👪</span>
            <span>
              {student.parent?.firstName || ""} {student.parent?.lastName || ""}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";

// Dynamic Imports
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Plural mapping for API endpoints
const API_PATHS: Record<string, string> = {
  teacher: "teachers",
  student: "students",
  parent: "parents",
  subject: "subjects",
  class: "classes",
  lesson: "lessons",
  exam: "exams",
  assignment: "assignments",
  result: "results",
  attendance: "attendance",
  event: "events",
  announcement: "announcements",
};

const getApiPath = (table: string) => API_PATHS[table] || `${table}s`;

// Forms mapping — passes onSuccess to each form
const forms: Record<
  string,
  (
    type: "create" | "update",
    data?: any,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => JSX.Element
> = {
  teacher: (type, data, onSuccess, onError) => (
    <TeacherForm
      type={type}
      data={data}
      onTeacherAdded={onSuccess}
      onError={onError}
    />
  ),
  student: (type, data, onSuccess, onError) => (
    <StudentForm 
      type={type} 
      data={data} 
      onStudentAdded={onSuccess}
      onError={onError}
    />
  ),
};

// ─── Props ───────────────────────────────────────────────────────────

export interface FormModalProps {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  /** Called after a successful create / update / delete */
  onSuccess?: () => void;
  /** Called when an error occurs */
  onError?: (error: string) => void;
  /** Called when the modal is closed (X button or backdrop) */
  onClose?: () => void;
  /** If true, modal opens immediately (no trigger button) */
  defaultOpen?: boolean;
  /** If true, the default trigger button is not rendered */
  hideTrigger?: boolean;
  /** Custom trigger element instead of the default circle button */
  trigger?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────

export default function FormModal({
  table,
  type,
  data,
  id,
  onSuccess,
  onError,
  onClose,
  defaultOpen = false,
  hideTrigger = false,
  trigger,
}: FormModalProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);

  // Sync internal state when defaultOpen changes
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow hover:bg-yellow-500"
      : type === "update"
      ? "bg-lamaSky hover:bg-blue-500"
      : "bg-lamaPurple hover:bg-purple-600";

  /** Close modal + notify parent */
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  /** Success handler - dispatches events and calls callbacks */
  const handleSuccess = () => {
    setOpen(false);
    
    // Dispatch custom event for real-time updates across components
    const eventType = `${table}${type === "create" ? "Created" : type === "update" ? "Updated" : "Deleted"}`;
    window.dispatchEvent(new CustomEvent(eventType, { detail: { id, data } }));
    window.dispatchEvent(new CustomEvent(`${table}Updated`)); // Generic update event
    
    // Call the success callback
    onSuccess?.();
    onClose?.();
  };

  /** Error handler */
  const handleError = (errorMsg: string) => {
    onError?.(errorMsg);
  };

  /** Handle delete operation */
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/${getApiPath(table)}?id=${id}`, {
        method: "DELETE",
      });
      
      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        handleSuccess();
      } else {
        const errorMessage = result.message || `Failed to delete ${table}`;
        handleError(errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = "Something went wrong";
      handleError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /** Render the appropriate form */
  const renderForm = () => {
    // ── DELETE ──────────────────────────────────────────────
    if (type === "delete" && id) {
      return (
        <form className="p-6 flex flex-col gap-4" onSubmit={handleDelete}>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete {table.charAt(0).toUpperCase() + table.slice(1)}
            </h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this {table}? All associated data will be permanently lost.
            </p>
          </div>

          <div className="flex gap-3 justify-center mt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </form>
      );
    }

    // ── CREATE / UPDATE ─────────────────────────────────────
    if (type === "create" || type === "update") {
      const formFn = forms[table];
      if (formFn) {
        return formFn(type, data, handleSuccess, handleError);
      }
      return (
        <div className="p-6 text-center">
          <p className="text-red-600">Form not found for {table}</p>
        </div>
      );
    }

    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Invalid action</p>
      </div>
    );
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      {!hideTrigger && !trigger && (
        <button
          title={
            type === "create"
              ? `Add new ${table}`
              : type === "update"
              ? `Edit ${table}`
              : `Delete ${table}`
          }
          className={`${size} flex items-center justify-center rounded-full ${bgColor} transition-all duration-200 hover:scale-110 shadow-sm`}
          onClick={() => setOpen(true)}
        >
          <Image src={`/${type}.png`} alt={type} width={16} height={16} />
        </button>
      )}

      {/* CUSTOM TRIGGER */}
      {!hideTrigger && trigger && (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      )}

      {/* MODAL OVERLAY */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
            {/* CLOSE BUTTON */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              onClick={handleClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {renderForm()}
          </div>
        </div>
      )}
    </>
  );
}
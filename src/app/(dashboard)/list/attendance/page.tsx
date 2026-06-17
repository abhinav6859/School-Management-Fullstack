"use client";

import { useState } from "react";

import AttendanceForm from "@/components/forms/AttendanceForm";
import AttendanceList from "@/components/list/AttendanceList";

export default function AttendancePage() {
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleAttendanceAdded = () => {
    setRefresh((prev) => prev + 1);
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Attendance Management
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition-all"
        >
          + Add Attendance
        </button>
      </div>

      {/* Attendance List */}
      <AttendanceList refresh={refresh} />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
              <h2 className="text-xl font-bold">
                Add Attendance
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-2xl text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <AttendanceForm
                onAttendanceAdded={
                  handleAttendanceAdded
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
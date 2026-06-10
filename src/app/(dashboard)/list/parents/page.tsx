"use client";

import { useState } from "react";

import ParentForm from "@/components/forms/ParentForm";
import ParentList from "@/components/list/ParentList";

export default function ParentsPage() {
  const [refresh, setRefresh] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleParentAdded = () => {
    setRefresh((prev) => prev + 1);
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Parent Management
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition-all"
        >
          + Add Parent
        </button>
      </div>

      {/* Parent List */}
      <ParentList refresh={refresh} />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Add Parent</h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <ParentForm onParentAdded={handleParentAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
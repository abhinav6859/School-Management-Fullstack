"use client";

import { useState } from "react";

import AttendanceForm from "@/components/forms/AttendanceForm";

import AttendanceList from "@/components/list/AttendanceList";

export default function AttendancePage() {
  const [refresh, setRefresh] =
    useState(0);

  return (
    <div className="max-w-6xl mx-auto p-10">
      <AttendanceForm
        onAttendanceAdded={() =>
          setRefresh(
            (prev) => prev + 1
          )
        }
      />

      <AttendanceList
        refresh={refresh}
      />
    </div>
  );
}
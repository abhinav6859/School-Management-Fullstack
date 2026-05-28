"use client";

import { useState } from "react";

import GradeForm from "@/components/forms/GradeForm";
import GradeList from "@/components/GradeList";

export default function GradesPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-10">
      <GradeForm
        onGradeAdded={() =>
          setRefresh((prev) => prev + 1)
        }
      />

      <GradeList refresh={refresh} />
    </div>
  );
}
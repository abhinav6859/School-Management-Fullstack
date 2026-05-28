"use client";

import { useState } from "react";

import SubjectForm from "@/components/forms/SubjectForm";
import SubjectList from "@/components/list/SubjectList";

export default function SubjectsPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-10">
      <SubjectForm
        onSubjectAdded={() =>
          setRefresh((prev) => prev + 1)
        }
      />

      <SubjectList refresh={refresh} />
    </div>
  );
}
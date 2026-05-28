"use client";

import { useState } from "react";

import ClassForm from "@/components//forms/ClassForm";
import ClassList from "@/components/list/ClassList";

export default function ClassesPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-10">
      <ClassForm
        onClassAdded={() =>
          setRefresh((prev) => prev + 1)
        }
      />

      <ClassList refresh={refresh} />
    </div>
  );
}
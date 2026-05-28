"use client";

import { useState } from "react";

import LessonForm from "@/components//forms/LessonForm";
import LessonList from "@/components/list/LessonList";

export default function LessonsPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-6xl mx-auto p-10">
      <LessonForm
        onLessonAdded={() =>
          setRefresh((prev) => prev + 1)
        }
      />

      <LessonList refresh={refresh} />
    </div>
  );
}
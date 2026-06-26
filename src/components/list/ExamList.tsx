"use client";

import { useEffect, useState } from "react";

interface Exam {
  id: number;
  title: string;
  lesson: {
    name: string;
  };
  teacher: {
    firstName: string;
    lastName: string;
  };
  results: {
    id: number;
  }[];
}

interface ExamListProps {
  refresh: number;
  page: number;
  onTotalPagesChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function ExamList({
  refresh,
  page,
  onTotalPagesChange,
}: ExamListProps) {

  // Add these two lines HERE
  void page;
  void onTotalPagesChange;

  const [exams, setExams] = useState<Exam[]>([]);

  const fetchExams = async () => {
    const res = await fetch("/api/exams");
    const data = await res.json();
    setExams(data);
  };

  useEffect(() => {
    fetchExams();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Exam List
      </h2>

      <div className="grid gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Exam:</strong>{" "}
              {exam.title}
            </p>

            <p>
              <strong>Lesson:</strong>{" "}
              {exam.lesson.name}
            </p>

            <p>
              <strong>Teacher:</strong>{" "}
              {exam.teacher.firstName}{" "}
              {exam.teacher.lastName}
            </p>

            <p>
              <strong>Total Results:</strong>{" "}
              {exam.results.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
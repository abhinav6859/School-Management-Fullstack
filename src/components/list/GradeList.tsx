"use client";

import { useEffect, useState } from "react";

interface Grade {
  id: number;
  level: number;

  classes: {
    id: number;
    name: string;
  }[];

  students: {
    id: string;
  }[];
}

export default function GradeList({
  refresh,
}: {
  refresh: number;
}) {
  const [grades, setGrades] = useState<
    Grade[]
  >([]);

  const fetchGrades = async () => {
    const res = await fetch("/api/grades");

    const data = await res.json();

    setGrades(data);
  };

  useEffect(() => {
    fetchGrades();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Grade List
      </h2>

      <div className="grid gap-4">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Grade:</strong>{" "}
              {grade.level}
            </p>

            <p>
              <strong>Total Classes:</strong>{" "}
              {grade.classes.length}
            </p>

            <p>
              <strong>Total Students:</strong>{" "}
              {grade.students.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
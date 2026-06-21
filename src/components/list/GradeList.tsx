"use client";

import { useEffect, useState, useCallback } from "react";

interface Grade {
  id: number;
  level: number;
  _count: {
    classes: number;
    students: number;
  };
}

export default function GradeList({
  refresh,
}: {
  refresh: number;
}) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/grades", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch grades");
      }

      const data = await res.json();

      setGrades(data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades, refresh]);

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Grade List
        </h2>

        <div className="text-gray-500">
          Loading grades...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Grade List
      </h2>

      {grades.length === 0 ? (
        <div className="text-gray-500">
          No grades found
        </div>
      ) : (
        <div className="grid gap-4">
          {grades.map((grade) => (
            <div
              key={grade.id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <p>
                <strong>Grade:</strong>{" "}
                {grade.level}
              </p>

              <p>
                <strong>Total Classes:</strong>{" "}
                {grade._count.classes}
              </p>

              <p>
                <strong>Total Students:</strong>{" "}
                {grade._count.students}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
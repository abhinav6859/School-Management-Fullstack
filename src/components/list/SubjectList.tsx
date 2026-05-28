"use client";

import { useEffect, useState } from "react";

interface Subject {
  id: number;
  name: string;

  teachers: {
    id: string;
    firstName: string;
    lastName: string;
  }[];

  lessons: {
    id: number;
  }[];
}

export default function SubjectList({
  refresh,
}: {
  refresh: number;
}) {
  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const fetchSubjects = async () => {
    const res = await fetch("/api/subjects");

    const data = await res.json();

    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Subject List
      </h2>

      <div className="grid gap-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Subject:</strong>{" "}
              {subject.name}
            </p>

            <p>
              <strong>Total Lessons:</strong>{" "}
              {subject.lessons.length}
            </p>

            <div className="mt-2">
              <strong>Teachers:</strong>

              <ul className="list-disc ml-5">
                {subject.teachers.map(
                  (teacher) => (
                    <li key={teacher.id}>
                      {teacher.firstName}{" "}
                      {teacher.lastName}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
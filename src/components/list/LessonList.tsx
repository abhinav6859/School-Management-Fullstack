"use client";

import { useEffect, useState } from "react";

interface Lesson {
  id: number;
  name: string;
  day: string;

  subject: {
    name: string;
  };

  class: {
    name: string;
  };

  teacher: {
    firstName: string;
    lastName: string;
  };

  exams: {
    id: number;
  }[];

  assignments: {
    id: number;
  }[];
}

export default function LessonList({
  refresh,
}: {
  refresh: number;
}) {
  const [lessons, setLessons] = useState<
    Lesson[]
  >([]);

  const fetchLessons = async () => {
    const res = await fetch("/api/lessons");

    const data = await res.json();

    setLessons(data);
  };

  useEffect(() => {
    fetchLessons();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Lesson List
      </h2>

      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Lesson:</strong>{" "}
              {lesson.name}
            </p>

            <p>
              <strong>Day:</strong>{" "}
              {lesson.day}
            </p>

            <p>
              <strong>Subject:</strong>{" "}
              {lesson.subject.name}
            </p>

            <p>
              <strong>Class:</strong>{" "}
              {lesson.class.name}
            </p>

            <p>
              <strong>Teacher:</strong>{" "}
              {lesson.teacher.firstName}{" "}
              {lesson.teacher.lastName}
            </p>

            <p>
              <strong>Exams:</strong>{" "}
              {lesson.exams.length}
            </p>

            <p>
              <strong>Assignments:</strong>{" "}
              {lesson.assignments.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
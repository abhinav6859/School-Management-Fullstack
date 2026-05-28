"use client";

import { useEffect, useState } from "react";

interface Assignment {
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

export default function AssignmentList({
  refresh,
}: {
  refresh: number;
}) {
  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const fetchAssignments =
    async () => {
      const res = await fetch(
        "/api/assignments"
      );

      const data =
        await res.json();

      setAssignments(data);
    };

  useEffect(() => {
    fetchAssignments();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Assignment List
      </h2>

      <div className="grid gap-4">
        {assignments.map(
          (assignment) => (
            <div
              key={
                assignment.id
              }
              className="border p-4 rounded-lg shadow"
            >
              <p>
                <strong>
                  Assignment:
                </strong>{" "}
                {
                  assignment.title
                }
              </p>

              <p>
                <strong>
                  Lesson:
                </strong>{" "}
                {
                  assignment
                    .lesson.name
                }
              </p>

              <p>
                <strong>
                  Teacher:
                </strong>{" "}
                {
                  assignment
                    .teacher
                    .firstName
                }{" "}
                {
                  assignment
                    .teacher
                    .lastName
                }
              </p>

              <p>
                <strong>
                  Results:
                </strong>{" "}
                {
                  assignment
                    .results.length
                }
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

interface Result {
  id: number;
  score: number;

  student: {
    firstName: string;
    lastName: string;
  };

  exam?: {
    title: string;
  };

  assignment?: {
    title: string;
  };
}

export default function ResultList({
  refresh,
}: {
  refresh: number;
}) {
  const [results, setResults] =
    useState<Result[]>([]);

  const fetchResults =
    async () => {
      const res = await fetch(
        "/api/results"
      );

      const data =
        await res.json();

      setResults(data);
    };

  useEffect(() => {
    fetchResults();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Result List
      </h2>

      <div className="grid gap-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>
                Student:
              </strong>{" "}
              {
                result.student
                  .firstName
              }{" "}
              {
                result.student
                  .lastName
              }
            </p>

            <p>
              <strong>
                Score:
              </strong>{" "}
              {result.score}
            </p>

            <p>
              <strong>
                Exam:
              </strong>{" "}
              {result.exam
                ?.title ||
                "N/A"}
            </p>

            <p>
              <strong>
                Assignment:
              </strong>{" "}
              {result.assignment
                ?.title ||
                "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
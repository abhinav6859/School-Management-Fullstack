"use client";

import { useState } from "react";

export default function GradeForm({
  onGradeAdded,
}: {
  onGradeAdded: () => void;
}) {
  const [level, setLevel] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
        }),
      });

      if (res.ok) {
        alert("Grade Added");

        setLevel("");

        onGradeAdded();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-5 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">
        Add Grade
      </h2>

      <input
        type="number"
        placeholder="Grade Level"
        value={level}
        onChange={(e) =>
          setLevel(e.target.value)
        }
        className="border p-2 w-full mb-4"
        required
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Grade
      </button>
    </form>
  );
}
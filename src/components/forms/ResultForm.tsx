"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Exam {
  id: number;
  title: string;
}

interface Assignment {
  id: number;
  title: string;
}

export default function ResultForm({
  onResultAdded,
}: {
  onResultAdded: () => void;
}) {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [exams, setExams] =
    useState<Exam[]>([]);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [formData, setFormData] =
    useState({
      score: "",
      studentId: "",
      examId: "",
      assignmentId: "",
    });

  useEffect(() => {
    fetchStudents();
    fetchExams();
    fetchAssignments();
  }, []);

  const fetchStudents =
    async () => {
      const res = await fetch(
        "/api/students"
      );

      const data =
        await res.json();

      setStudents(data);
    };

  const fetchExams = async () => {
    const res = await fetch(
      "/api/exams"
    );

    const data = await res.json();

    setExams(data);
  };

  const fetchAssignments =
    async () => {
      const res = await fetch(
        "/api/assignments"
      );

      const data =
        await res.json();

      setAssignments(data);
    };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "/api/results",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      if (res.ok) {
        alert("Result Added");

        setFormData({
          score: "",
          studentId: "",
          examId: "",
          assignmentId: "",
        });

        onResultAdded();
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
        Add Result
      </h2>

      <input
        type="number"
        step="0.1"
        name="score"
        placeholder="Score"
        value={formData.score}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <select
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      >
        <option value="">
          Select Student
        </option>

        {students.map(
          (student) => (
            <option
              key={student.id}
              value={student.id}
            >
              {
                student.firstName
              }{" "}
              {
                student.lastName
              }
            </option>
          )
        )}
      </select>

      <select
        name="examId"
        value={formData.examId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="">
          Select Exam
        </option>

        {exams.map((exam) => (
          <option
            key={exam.id}
            value={exam.id}
          >
            {exam.title}
          </option>
        ))}
      </select>

      <select
        name="assignmentId"
        value={
          formData.assignmentId
        }
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="">
          Select Assignment
        </option>

        {assignments.map(
          (assignment) => (
            <option
              key={
                assignment.id
              }
              value={
                assignment.id
              }
            >
              {
                assignment.title
              }
            </option>
          )
        )}
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Result
      </button>
    </form>
  );
}
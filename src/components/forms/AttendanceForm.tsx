"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Lesson {
  id: number;
  name: string;
}

export default function AttendanceForm({
  onAttendanceAdded,
}: {
  onAttendanceAdded: () => void;
}) {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [lessons, setLessons] =
    useState<Lesson[]>([]);

  const [formData, setFormData] =
    useState({
      date: "",
      present: true,
      studentId: "",
      lessonId: "",
    });

  useEffect(() => {
    fetchStudents();
    fetchLessons();
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

  const fetchLessons =
    async () => {
      const res = await fetch(
        "/api/lessons"
      );

      const data =
        await res.json();

      setLessons(data);
    };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {
    const value =
      e.target.name === "present"
        ? e.target.value === "true"
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "/api/attendance",
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
        alert(
          "Attendance Added"
        );

        setFormData({
          date: "",
          present: true,
          studentId: "",
          lessonId: "",
        });

        onAttendanceAdded();
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
        Add Attendance
      </h2>

      <input
        type="date"
        name="date"
        value={formData.date}
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
        name="lessonId"
        value={formData.lessonId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      >
        <option value="">
          Select Lesson
        </option>

        {lessons.map((lesson) => (
          <option
            key={lesson.id}
            value={lesson.id}
          >
            {lesson.name}
          </option>
        ))}
      </select>

      <select
        name="present"
        value={String(
          formData.present
        )}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="true">
          Present
        </option>

        <option value="false">
          Absent
        </option>
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Attendance
      </button>
    </form>
  );
}
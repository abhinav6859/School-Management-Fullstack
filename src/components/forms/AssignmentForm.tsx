"use client";

import { useEffect, useState } from "react";

interface Lesson {
  id: number;
  name: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

export default function AssignmentForm({
  onAssignmentAdded,
}: {
  onAssignmentAdded: () => void;
}) {
  const [lessons, setLessons] =
    useState<Lesson[]>([]);

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [formData, setFormData] =
    useState({
      title: "",
      startDate: "",
      dueDate: "",
      lessonId: "",
      teacherId: "",
    });

  useEffect(() => {
    fetchLessons();
    fetchTeachers();
  }, []);

  const fetchLessons = async () => {
    const res = await fetch(
      "/api/lessons"
    );

    const data = await res.json();

    setLessons(data);
  };

  const fetchTeachers = async () => {
    const res = await fetch(
      "/api/teachers"
    );

    const data = await res.json();

    setTeachers(data);
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
        "/api/assignments",
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
          "Assignment Added"
        );

        setFormData({
          title: "",
          startDate: "",
          dueDate: "",
          lessonId: "",
          teacherId: "",
        });

        onAssignmentAdded();
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
        Add Assignment
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Assignment Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <input
        type="datetime-local"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <input
        type="datetime-local"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

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

        {lessons.map(
          (lesson) => (
            <option
              key={lesson.id}
              value={lesson.id}
            >
              {lesson.name}
            </option>
          )
        )}
      </select>

      <select
        name="teacherId"
        value={formData.teacherId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      >
        <option value="">
          Select Teacher
        </option>

        {teachers.map(
          (teacher) => (
            <option
              key={teacher.id}
              value={teacher.id}
            >
              {
                teacher.firstName
              }{" "}
              {
                teacher.lastName
              }
            </option>
          )
        )}
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Assignment
      </button>
    </form>
  );
}
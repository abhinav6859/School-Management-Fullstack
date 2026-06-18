"use client";

import { useEffect, useState } from "react";

interface Subject {
  id: number;
  name: string;
}

interface ClassItem {
  id: number;
  name: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

export default function LessonForm({
  onLessonAdded,
}: {
  onLessonAdded: () => void;
}) {
  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [classes, setClasses] =
    useState<ClassItem[]>([]);

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    day: "MONDAY",
    startTime: "",
    endTime: "",
    subjectId: "",
    classId: "",
    teacherId: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    const res = await fetch("/api/subjects");
    const data = await res.json();

    setSubjects(data);
  };

  const fetchClasses = async () => {
    const res = await fetch("/api/classes");
    const data = await res.json();

    setClasses(data);
  };

  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers?all=true");
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/lessons", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Lesson Added");

        setFormData({
          name: "",
          day: "MONDAY",
          startTime: "",
          endTime: "",
          subjectId: "",
          classId: "",
          teacherId: "",
        });

        onLessonAdded();
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
        Add Lesson
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Lesson Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <select
        name="day"
        value={formData.day}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="MONDAY">
          MONDAY
        </option>

        <option value="TUESDAY">
          TUESDAY
        </option>

        <option value="WEDNESDAY">
          WEDNESDAY
        </option>

        <option value="THURSDAY">
          THURSDAY
        </option>

        <option value="FRIDAY">
          FRIDAY
        </option>
      </select>

      <input
        type="datetime-local"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <input
        type="datetime-local"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <select
        name="subjectId"
        value={formData.subjectId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      >
        <option value="">
          Select Subject
        </option>

        {subjects.map((subject) => (
          <option
            key={subject.id}
            value={subject.id}
          >
            {subject.name}
          </option>
        ))}
      </select>

      <select
        name="classId"
        value={formData.classId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      >
        <option value="">
          Select Class
        </option>

        {classes.map((cls) => (
          <option
            key={cls.id}
            value={cls.id}
          >
            {cls.name}
          </option>
        ))}
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

        {teachers.map((teacher) => (
          <option
            key={teacher.id}
            value={teacher.id}
          >
            {teacher.firstName}{" "}
            {teacher.lastName}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Lesson
      </button>
    </form>
  );
}
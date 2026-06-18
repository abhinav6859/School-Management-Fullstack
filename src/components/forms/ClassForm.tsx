"use client";

import { useEffect, useState } from "react";

interface Grade {
  id: number;
  level: number;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

export default function ClassForm({
  onClassAdded,
}: {
  onClassAdded: () => void;
}) {
  const [grades, setGrades] = useState<
    Grade[]
  >([]);

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    gradeId: "",
    supervisorId: "",
  });

  useEffect(() => {
    fetchGrades();
    fetchTeachers();
  }, []);

  const fetchGrades = async () => {
    const res = await fetch("/api/grades");
    const data = await res.json();

    setGrades(data);
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
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Class Added");

        setFormData({
          name: "",
          capacity: "",
          gradeId: "",
          supervisorId: "",
        });

        onClassAdded();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
     

      <input
        type="text"
        name="name"
        placeholder="Class Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <input
        type="number"
        name="capacity"
        placeholder="Capacity"
        value={formData.capacity}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <select
        name="gradeId"
        value={formData.gradeId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      >
        <option value="">
          Select Grade
        </option>

        {grades.map((grade) => (
          <option
            key={grade.id}
            value={grade.id}
          >
            Grade {grade.level}
          </option>
        ))}
      </select>

      <select
        name="supervisorId"
        value={formData.supervisorId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="">
          Select Supervisor
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
        Save Class
      </button>
    </form>
  );
}
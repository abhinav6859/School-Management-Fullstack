"use client";

import { useEffect, useState } from "react";

interface Teacher {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
}

export default function TeacherList({
  refresh,
}: {
  refresh: number;
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");
    const data = await res.json();

    setTeachers(data);
  };

  useEffect(() => {
    fetchTeachers();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Teachers List</h2>

      <div className="grid gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Name:</strong> {teacher.firstName}{" "}
              {teacher.lastName}
            </p>

            <p>
              <strong>Username:</strong> {teacher.username}
            </p>

            <p>
              <strong>Email:</strong> {teacher.email}
            </p>

            <p>
              <strong>Gender:</strong> {teacher.gender}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
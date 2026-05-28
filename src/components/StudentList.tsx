"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  sex: string;

  parent: {
    firstName: string;
    lastName: string;
  };

  class: {
    name: string;
  };

  grade: {
    level: number;
  };
}

export default function StudentList({
  refresh,
}: {
  refresh: number;
}) {
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();

    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Student List
      </h2>

      <div className="grid gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Name:</strong>{" "}
              {student.firstName}{" "}
              {student.lastName}
            </p>

            <p>
              <strong>Username:</strong>{" "}
              {student.username}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {student.email}
            </p>

            <p>
              <strong>Gender:</strong>{" "}
              {student.sex}
            </p>

            <p>
              <strong>Parent:</strong>{" "}
              {student.parent.firstName}{" "}
              {student.parent.lastName}
            </p>

            <p>
              <strong>Grade:</strong>{" "}
              {student.grade.level}
            </p>

            <p>
              <strong>Class:</strong>{" "}
              {student.class.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
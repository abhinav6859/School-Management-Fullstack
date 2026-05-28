"use client";

import { useEffect, useState } from "react";

interface ClassItem {
  id: number;
  name: string;
  capacity: number;

  grade: {
    level: number;
  };

  supervisor?: {
    firstName: string;
    lastName: string;
  };

  students: {
    id: string;
  }[];
}

export default function ClassList({
  refresh,
}: {
  refresh: number;
}) {
  const [classes, setClasses] = useState<
    ClassItem[]
  >([]);

  const fetchClasses = async () => {
    const res = await fetch("/api/classes");

    const data = await res.json();

    setClasses(data);
  };

  useEffect(() => {
    fetchClasses();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Class List
      </h2>

      <div className="grid gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Name:</strong>{" "}
              {cls.name}
            </p>

            <p>
              <strong>Grade:</strong>{" "}
              {cls.grade.level}
            </p>

            <p>
              <strong>Capacity:</strong>{" "}
              {cls.capacity}
            </p>

            <p>
              <strong>Students:</strong>{" "}
              {cls.students.length}
            </p>

            <p>
              <strong>Supervisor:</strong>{" "}
              {cls.supervisor
                ? `${cls.supervisor.firstName} ${cls.supervisor.lastName}`
                : "No Supervisor"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
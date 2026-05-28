"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Parent {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;

  students: Student[];
}

export default function ParentList({
  refresh,
}: {
  refresh: number;
}) {
  const [parents, setParents] = useState<Parent[]>([]);

  const fetchParents = async () => {
    const res = await fetch("/api/parents");
    const data = await res.json();

    setParents(data);
  };

  useEffect(() => {
    fetchParents();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Parent List
      </h2>

      <div className="grid gap-4">
        {parents.map((parent) => (
          <div
            key={parent.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Name:</strong>{" "}
              {parent.firstName}{" "}
              {parent.lastName}
            </p>

            <p>
              <strong>Username:</strong>{" "}
              {parent.username}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {parent.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {parent.phone}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {parent.address}
            </p>

            <div className="mt-2">
              <strong>Children:</strong>

              {parent.students.length > 0 ? (
                <ul className="list-disc ml-5">
                  {parent.students.map((student) => (
                    <li key={student.id}>
                      {student.firstName}{" "}
                      {student.lastName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No Students</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
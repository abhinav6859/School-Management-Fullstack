"use client";

import { useEffect, useState } from "react";

interface Attendance {
  id: number;
  date: string;
  present: boolean;

  student: {
    firstName: string;
    lastName: string;
  };

  lesson: {
    name: string;
  };
}

export default function AttendanceList({
  refresh,
}: {
  refresh: number;
}) {
  const [attendance,
    setAttendance] =
    useState<Attendance[]>([]);

  const fetchAttendance =
    async () => {
      const res = await fetch(
        "/api/attendance"
      );

      const data =
        await res.json();

      setAttendance(data);
    };

  useEffect(() => {
    fetchAttendance();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Attendance List
      </h2>

      <div className="grid gap-4">
        {attendance.map(
          (item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg shadow"
            >
              <p>
                <strong>
                  Student:
                </strong>{" "}
                {
                  item.student
                    .firstName
                }{" "}
                {
                  item.student
                    .lastName
                }
              </p>

              <p>
                <strong>
                  Lesson:
                </strong>{" "}
                {
                  item.lesson.name
                }
              </p>

              <p>
                <strong>
                  Date:
                </strong>{" "}
                {item.date}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {item.present
                  ? "Present"
                  : "Absent"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
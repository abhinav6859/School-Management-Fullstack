"use client";

import { useEffect, useState } from "react";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

export default function SubjectForm({
  onSubjectAdded,
}: {
  onSubjectAdded: () => void;
}) {
  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [name, setName] = useState("");

  const [teacherIds, setTeacherIds] =
    useState<string[]>([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");

    const data = await res.json();

    setTeachers(data);
  };

  const handleTeacherChange = (
    teacherId: string
  ) => {
    if (teacherIds.includes(teacherId)) {
      setTeacherIds(
        teacherIds.filter(
          (id) => id !== teacherId
        )
      );
    } else {
      setTeacherIds([
        ...teacherIds,
        teacherId,
      ]);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          teacherIds,
        }),
      });

      if (res.ok) {
        alert("Subject Added");

        setName("");
        setTeacherIds([]);

        onSubjectAdded();
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
        Add Subject
      </h2>

      <input
        type="text"
        placeholder="Subject Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        className="border p-2 w-full mb-4"
        required
      />

      <div className="mb-4">
        <h3 className="font-semibold mb-2">
          Select Teachers
        </h3>

        <div className="grid gap-2">
          {teachers.map((teacher) => (
            <label
              key={teacher.id}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={teacherIds.includes(
                  teacher.id
                )}
                onChange={() =>
                  handleTeacherChange(
                    teacher.id
                  )
                }
              />

              {teacher.firstName}{" "}
              {teacher.lastName}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Subject
      </button>
    </form>
  );
}
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [name, setName] = useState("");
  const [teacherIds, setTeacherIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast.error("Failed to load teachers");
    }
  };

  const handleTeacherChange = (teacherId: string) => {
    if (teacherIds.includes(teacherId)) {
      setTeacherIds(teacherIds.filter((id) => id !== teacherId));
    } else {
      setTeacherIds([...teacherIds, teacherId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name is not empty
    if (!name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/subjects", {
      
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          teacherIds,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Subject added successfully");
        setName("");
        setTeacherIds([]);
        onSubjectAdded();
      } else {
        // Show error message from API
        toast.error(data.message || "Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* <h2 className="text-2xl font-bold mb-4">Add Subject</h2> */}

      <input
        type="text"
        placeholder="Subject Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-4"
        required
        disabled={isLoading}
      />

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Select Teachers</h3>

        <div className="grid gap-2">
          {teachers.length === 0 ? (
            <p className="text-gray-500">Loading teachers...</p>
          ) : (
            teachers.map((teacher) => (
              <label key={teacher.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={teacherIds.includes(teacher.id)}
                  onChange={() => handleTeacherChange(teacher.id)}
                  disabled={isLoading}
                />
                {teacher.firstName} {teacher.lastName}
              </label>
            ))
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {isLoading ? "Saving..." : "Save Subject"}
      </button>
    </form>
  );
}
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

interface ApiResponse {
  success: boolean;
  data: Teacher[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
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
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);


  const fetchTeachers = async () => {
  setIsLoadingTeachers(true);

  try {
    const res = await fetch("/api/teachers?all=true");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Teacher[] = await res.json();

    setTeachers(data);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    setTeachers([]);
    toast.error("Failed to load teachers");
  } finally {
    setIsLoadingTeachers(false);
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
        toast.error(data.message || "Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTeachersList = () => {
    if (isLoadingTeachers) {
      return <p className="text-gray-500">Loading teachers...</p>;
    }

    if (!Array.isArray(teachers) || teachers.length === 0) {
      return <p className="text-gray-500">No teachers available</p>;
    }

    return teachers.map((teacher) => (
      <label key={teacher.id} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={teacherIds.includes(teacher.id)}
          onChange={() => handleTeacherChange(teacher.id)}
          disabled={isLoading}
        />
        {teacher.firstName} {teacher.lastName}
      </label>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          {renderTeachersList()}
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
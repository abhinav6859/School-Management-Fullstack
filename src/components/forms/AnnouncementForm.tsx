"use client";

import { useEffect, useState } from "react";

interface ClassItem {
  id: number;
  name: string;
}

export default function AnnouncementForm({
  onAnnouncementAdded,
}: {
  onAnnouncementAdded: () => void;
}) {
  const [classes, setClasses] =
    useState<ClassItem[]>([]);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      date: "",
      classId: "",
    });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await fetch("/api/classes");

    const data = await res.json();

    setClasses(data);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "/api/announcements",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      if (res.ok) {
        alert(
          "Announcement Added"
        );

        setFormData({
          title: "",
          description: "",
          date: "",
          classId: "",
        });

        onAnnouncementAdded();
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
        Add Announcement
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Announcement Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        rows={4}
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <select
        name="classId"
        value={formData.classId}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
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

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Announcement
      </button>
    </form>
  );
}
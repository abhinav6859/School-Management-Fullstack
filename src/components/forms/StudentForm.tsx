

"use client";

import { useEffect, useState } from "react";

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
}

interface Grade {
  id: number;
  level: number;
}

interface ClassItem {
  id: number;
  name: string;
}

export default function StudentForm({
  onStudentAdded,
}: {
  onStudentAdded: () => void;
}) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    sex: "MALE",
    birthday: "",
    parentId: "",
    gradeId: "",
    classId: "",
  });

  useEffect(() => {
    fetchParents();
    fetchGrades();
    fetchClasses();
  }, []);

  const fetchParents = async () => {
    const res = await fetch("/api/parents");
    const data = await res.json();
    setParents(data);
  };

  const fetchGrades = async () => {
    const res = await fetch("/api/grades");
    const data = await res.json();
    setGrades(data);
  };

  const fetchClasses = async () => {
    const res = await fetch("/api/classes");
    const data = await res.json();
    setClasses(data);
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
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Student Added");

        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          bloodType: "",
          sex: "MALE",
          birthday: "",
          parentId: "",
          gradeId: "",
          classId: "",
        });

        onStudentAdded();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-5 rounded-lg"
    >
      <h2 className="text-2xl font-bold">
        Add Student
      </h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        type="text"
        name="bloodType"
        placeholder="Blood Type"
        value={formData.bloodType}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="date"
        name="birthday"
        value={formData.birthday}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <select
        name="sex"
        value={formData.sex}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="MALE">MALE</option>
        <option value="FEMALE">FEMALE</option>
      </select>

      <select
        name="parentId"
        value={formData.parentId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Parent</option>

        {parents.map((parent) => (
          <option
            key={parent.id}
            value={parent.id}
          >
            {parent.firstName} {parent.lastName}
          </option>
        ))}
      </select>

      <select
        name="gradeId"
        value={formData.gradeId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Grade</option>
       


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
        name="classId"
        value={formData.classId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Class</option>
       

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
        Save Student
      </button>
    </form>
  );
}
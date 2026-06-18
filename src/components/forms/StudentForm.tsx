"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

interface StudentFormProps {
  type: "create" | "update";
  data?: any;
  onStudentAdded?: () => void;
}

export default function StudentForm({
  type,
  data,
  onStudentAdded,
}: StudentFormProps) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(true);
  const [isLoadingGrades, setIsLoadingGrades] = useState(true);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

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
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (type === "update" && data) {
      setFormData({
        username: data.username || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        bloodType: data.bloodType || "",
        sex: data.sex || "MALE",
        birthday: data.birthday
          ? new Date(data.birthday).toISOString().split("T")[0]
          : "",
        parentId: data.parentId || "",
        gradeId: data.gradeId?.toString() || "",
        classId: data.classId?.toString() || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [type, data]);

  useEffect(() => {
    fetchParents();
    fetchGrades();
    fetchClasses();
  }, []);

  const fetchParents = async () => {
    setIsLoadingParents(true);
    try {
      const res = await fetch("/api/parents");
      if (!res.ok) throw new Error("Failed to fetch parents");
      const data = await res.json();
      // Handle both array and paginated response
      setParents(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      toast.error("Failed to load parents");
      setParents([]);
    } finally {
      setIsLoadingParents(false);
    }
  };

  const fetchGrades = async () => {
    setIsLoadingGrades(true);
    try {
      const res = await fetch("/api/grades");
      if (!res.ok) throw new Error("Failed to fetch grades");
      const data = await res.json();
      setGrades(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
      toast.error("Failed to load grades");
      setGrades([]);
    } finally {
      setIsLoadingGrades(false);
    }
  };

  const fetchClasses = async () => {
    setIsLoadingClasses(true);
    try {
      const res = await fetch("/api/classes");
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      toast.error("Failed to load classes");
      setClasses([]);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.bloodType.trim()) {
      toast.error("Blood type is required");
      return false;
    }
    if (!formData.birthday) {
      toast.error("Birthday is required");
      return false;
    }
    if (!formData.parentId) {
      toast.error("Please select a parent");
      return false;
    }
    if (!formData.gradeId) {
      toast.error("Please select a grade");
      return false;
    }
    if (!formData.classId) {
      toast.error("Please select a class");
      return false;
    }

    // Password validation (only for create)
    if (type === "create") {
      if (!formData.password) {
        toast.error("Password is required");
        return false;
      }
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }

    // Optional: Update password if provided
    if (type === "update" && formData.password) {
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = "/api/students";
      const method = type === "create" ? "POST" : "PUT";

      // Prepare data for submission
      const submitData: any = {
        ...(type === "update" && { id: data.id }),
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        bloodType: formData.bloodType,
        sex: formData.sex,
        birthday: formData.birthday,
        parentId: formData.parentId,
        gradeId: parseInt(formData.gradeId),
        classId: parseInt(formData.classId),
      };

      // Add password only if provided (always for create, optional for update)
      if (type === "create" || formData.password) {
        submitData.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          type === "create"
            ? "Student Added Successfully"
            : "Student Updated Successfully"
        );

        // Reset form for create
        if (type === "create") {
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
            password: "",
            confirmPassword: "",
          });
        }

        onStudentAdded?.();
      } else {
        toast.error(result.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting student:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded-lg">
      <h2 className="text-2xl font-bold">
        {type === "create" ? "Add Student" : "Update Student"}
      </h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading}
      />

      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading}
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading}
      />

      <input
        type="email"
        name="email"
        placeholder="Email (Optional)"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        disabled={loading}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone (Optional)"
        value={formData.phone}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        disabled={loading}
      />

      <input
        type="text"
        name="address"
        placeholder="Address (Optional)"
        value={formData.address}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        disabled={loading}
      />

      <input
        type="text"
        name="bloodType"
        placeholder="Blood Type"
        value={formData.bloodType}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading}
      />

      <input
        type="date"
        name="birthday"
        value={formData.birthday}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading}
      />

      <select
        name="sex"
        value={formData.sex}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        disabled={loading}
      >
        <option value="MALE">MALE</option>
        <option value="FEMALE">FEMALE</option>
      </select>

      <select
        name="parentId"
        value={formData.parentId}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading || isLoadingParents}
      >
        <option value="">Select Parent</option>
        {isLoadingParents ? (
          <option disabled>Loading parents...</option>
        ) : (
          parents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.firstName} {parent.lastName}
            </option>
          ))
        )}
      </select>

      <select
        name="gradeId"
        value={formData.gradeId}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading || isLoadingGrades}
      >
        <option value="">Select Grade</option>
        {isLoadingGrades ? (
          <option disabled>Loading grades...</option>
        ) : (
          grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              Grade {grade.level}
            </option>
          ))
        )}
      </select>

      <select
        name="classId"
        value={formData.classId}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
        disabled={loading || isLoadingClasses}
      >
        <option value="">Select Class</option>
        {isLoadingClasses ? (
          <option disabled>Loading classes...</option>
        ) : (
          classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))
        )}
      </select>

      {/* Password Section */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={
              type === "create"
                ? "Password (min. 8 characters)"
                : "New Password (leave blank to keep current)"
            }
            value={formData.password}
            onChange={handleChange}
            className="border p-2 w-full rounded pr-10"
            required={type === "create"}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required={type === "create"}
          disabled={loading}
        />

        {/* Password requirements */}
        {(type === "create" || formData.password) && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>Password must:</p>
            <ul className="list-disc pl-4">
              <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                Be at least 8 characters long
              </li>
              <li className={formData.password === formData.confirmPassword && formData.password.length > 0 ? "text-green-500" : ""}>
                Match the confirmation password
              </li>
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300 w-full"
      >
        {loading ? "Saving..." : type === "create" ? "Create Student" : "Update Student"}
      </button>
    </form>
  );
}
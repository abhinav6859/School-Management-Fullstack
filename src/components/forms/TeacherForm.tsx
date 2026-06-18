"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface TeacherFormProps {
  type?: "create" | "update";
  data?: any;
  onTeacherAdded?: () => void;
}

export default function TeacherForm({
  type = "create",
  data,
  onTeacherAdded,
}: TeacherFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    gender: "MALE",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Show popup message
  const showPopup = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    Swal.fire({
      title,
      text: message,
      icon: type,
      confirmButtonColor: type === 'success' ? '#3085d6' : '#d33',
      confirmButtonText: 'OK',
      timer: type === 'success' ? 2000 : undefined,
      timerProgressBar: type === 'success',
    });
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username must be at most 20 characters";
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (if provided)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (minimum 10 digits)";
    }

    // Blood type validation (if provided)
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (formData.bloodType && !validBloodTypes.includes(formData.bloodType.toUpperCase())) {
      newErrors.bloodType = "Please enter a valid blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showPopup("Validation Error", firstError, "error");
      return false;
    }

    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...submitData } = formData;
      
      console.log("Submitting teacher data:", submitData);

      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        showPopup("Success!", "Teacher added successfully!", "success");

        // Reset form
        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          bloodType: "",
          gender: "MALE",
          password: "",
          confirmPassword: "",
        });
        setErrors({});

        onTeacherAdded?.();
      } else {
        // Error popup based on status code
        if (res.status === 409) {
          showPopup("Duplicate Error", data.message || "Teacher with this email or username already exists!", "error");
        } else if (res.status === 400) {
          showPopup("Validation Error", data.message || "Please check your input", "error");
        } else {
          showPopup("Error", data.message || "Failed to add teacher", "error");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showPopup("Error", "Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded-lg">
      <h2 className="text-2xl font-bold">Add Teacher</h2>

      {/* Username Field */}
      <div>
        <input
          type="text"
          name="username"
          placeholder="Username *"
          value={formData.username}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        )}
      </div>

      {/* First Name Field */}
      <div>
        <input
          type="text"
          name="firstName"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name Field */}
      <div>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <input
          type="text"
          name="phone"
          placeholder="Phone (Optional)"
          value={formData.phone}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">Format: +1234567890 or 1234567890</p>
      </div>

      {/* Address Field */}
      <div>
        <input
          type="text"
          name="address"
          placeholder="Address (Optional)"
          value={formData.address}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Blood Type Field */}
      <div>
        <input
          type="text"
          name="bloodType"
          placeholder="Blood Type (Optional) - e.g., A+, O-, B+"
          value={formData.bloodType}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.bloodType ? 'border-red-500' : 'border-gray-300'}`}
          list="bloodTypes"
        />
        <datalist id="bloodTypes">
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </datalist>
        {errors.bloodType && (
          <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
        )}
      </div>

      {/* Gender Field */}
      <div>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border p-2 w-full rounded border-gray-300"
        >
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
      </div>

      {/* Password Field */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password *"
          value={formData.password}
          onChange={handleChange}
          className={`border p-2 w-full rounded pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          Password must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`border p-2 w-full rounded pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showConfirmPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300 w-full"
      >
        {loading ? "Saving..." : "Save Teacher"}
      </button>
    </form>
  );
}
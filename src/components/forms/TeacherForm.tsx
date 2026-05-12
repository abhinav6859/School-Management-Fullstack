"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "@/components/button/SubmitButton";

// 1️⃣ Zod Schema (Single Source of Truth)
const teacherSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  teacherId: z.string().min(3, "Teacher ID required"),
});

// 2️⃣ Infer Type from Zod (NO manual types)
type TeacherFormValues = z.infer<typeof teacherSchema>;

const TeacherForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: Partial<TeacherFormValues>;
}) => {
  
  // 3️⃣ useForm setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      teacherId: data?.teacherId || "",
    },
  });

  // 4️⃣ Submit handler
  const onSubmit = async (formData: TeacherFormValues) => {
    console.log("Form Data:", formData);

    // simulate API
    await new Promise((res) => setTimeout(res, 1000));

    if (type === "create") {
      console.log("Creating teacher...");
    } else {
      console.log("Updating teacher...");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      
      <h2 className="text-lg font-semibold">
        {type === "create" ? "Create Teacher" : "Update Teacher"}
      </h2>

      {/* NAME */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500">Name</label>
        <input
          {...register("name")}
          className="border p-2 rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* EMAIL */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500">Email</label>
        <input
          {...register("email")}
          className="border p-2 rounded-md"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* TEACHER ID */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500">Teacher ID</label>
        <input
          {...register("teacherId")}
          className="border p-2 rounded-md"
        />
        {errors.teacherId && (
          <p className="text-red-500 text-xs">
            {errors.teacherId.message}
          </p>
        )}
      </div>

      {/* SUBMIT */}
      {/* <button
        disabled={isSubmitting}
        className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting
          ? "Submitting..."
          : type === "create"
          ? "Create Teacher"
          : "Update Teacher"}
      </button> */}
      <SubmitButton
  isSubmitting={isSubmitting}
  type={type}
  entity="Teacher"
/>
    </form>
  );
};

export default TeacherForm;
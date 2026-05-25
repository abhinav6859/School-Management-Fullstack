"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState } from "react";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" })
    .optional()
    .nullable(),
  email: z.string().email({ message: "Invalid email address!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required!" }),
  bloodType: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  supervisorId: z.string().optional().nullable(),
  subjects: z.array(z.string()).optional(),
  img: z.instanceof(File).optional().nullable(),
});

type Inputs = z.infer<typeof schema>;

// Mock data for dropdowns - replace with API calls
const TEACHERS_LIST = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Michael Brown" },
];

const SUBJECTS_LIST = [
  { id: "1", name: "Mathematics" },
  { id: "2", name: "Physics" },
  { id: "3", name: "Chemistry" },
  { id: "4", name: "Biology" },
  { id: "5", name: "English" },
];

const TeacherForm = ({
  type,
  data,
  onSubmitSuccess,
}: {
  type: "create" | "update";
  data?: any;
  onSubmitSuccess?: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data ? {
      username: data.username || "",
      email: data.email || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      phone: data.phone || "",
      address: data.address || "",
      gender: data.gender || "MALE",
      bloodType: data.bloodType || "",
      birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : "",
      supervisorId: data.supervisorId || "",
      subjects: data.subjects?.map((s: any) => s.id) || [],
    } : {
      gender: "MALE",
      subjects: [],
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the data for API
      const teacherData = {
        username: formData.username || null,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
        address: formData.address || null,
        gender: formData.gender,
        bloodType: formData.bloodType || null,
        birthday: formData.birthday ? new Date(formData.birthday) : null,
        supervisorId: formData.supervisorId || null,
        subjects: formData.subjects?.map(id => ({ id })) || [],
        role: "TEACHER",
      };

      // Handle image upload if exists
      if (formData.img) {
        const imageData = new FormData();
        imageData.append("file", formData.img);
        // Upload image and get URL - implement your image upload logic
        // const uploadResponse = await fetch("/api/upload", { method: "POST", body: imageData });
        // const { url } = await uploadResponse.json();
        // teacherData.image = url;
      }

      // API call to create/update teacher
      const response = await fetch(`/api/teachers${type === "update" && data?.id ? `/${data.id}` : ""}`, {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save teacher");
      }

      const savedTeacher = await response.json();
      console.log("Teacher saved:", savedTeacher);
      
      // Reset form if create mode
      if (type === "create") {
        reset();
      }
      
      // Call success callback
      onSubmitSuccess?.();
      
      // Show success message (implement your toast notification)
      alert(`Teacher ${type === "create" ? "created" : "updated"} successfully!`);
      
    } catch (error) {
      console.error("Error saving teacher:", error);
      setSubmitError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form className="flex flex-col gap-8 max-h-[80vh] overflow-y-auto px-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update teacher"}
      </h1>
  
      {submitError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {submitError}
        </div>
      )}
      
      <div>
        <span className="text-xs text-gray-400 font-medium">
          Authentication Information
        </span>
        <div className="flex justify-between flex-wrap gap-4 mt-4">
          <InputField
            label="Username (Optional)"
            name="username"
            defaultValue={data?.username}
            register={register}
            error={errors?.username}
          />
          <InputField
            label="Email"
            name="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />
        </div>
      </div>
      
      <div>
        <span className="text-xs text-gray-400 font-medium">
          Personal Information
        </span>
        <div className="flex justify-between flex-wrap gap-4 mt-4">
          <InputField
            label="First Name"
            name="firstName"
            defaultValue={data?.firstName}
            register={register}
            error={errors.firstName}
          />
          <InputField
            label="Last Name"
            name="lastName"
            defaultValue={data?.lastName}
            register={register}
            error={errors.lastName}
          />
          <InputField
            label="Phone (Optional)"
            name="phone"
            defaultValue={data?.phone}
            register={register}
            error={errors.phone}
          />
          <InputField
            label="Address (Optional)"
            name="address"
            defaultValue={data?.address}
            register={register}
            error={errors.address}
          />
          
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Gender *</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("gender")}
              defaultValue={data?.gender || "MALE"}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.gender?.message && (
              <p className="text-xs text-red-400">
                {errors.gender.message.toString()}
              </p>
            )}
          </div>
          
          <InputField
            label="Blood Type (Optional)"
            name="bloodType"
            defaultValue={data?.bloodType}
            register={register}
            error={errors.bloodType}
          />
          
          <InputField
            label="Birthday (Optional)"
            name="birthday"
            defaultValue={data?.birthday ? new Date(data.birthday).toISOString().split('T')[0] : ""}
            register={register}
            error={errors.birthday}
            type="date"
          />
        </div>
      </div>
      
      <div>
        <span className="text-xs text-gray-400 font-medium">
          Professional Information
        </span>
        <div className="flex justify-between flex-wrap gap-4 mt-4">
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Supervisor (Optional)</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("supervisorId")}
              defaultValue={data?.supervisorId || ""}
            >
              <option value="">None</option>
              {TEACHERS_LIST.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.supervisorId?.message && (
              <p className="text-xs text-red-400">
                {errors.supervisorId.message.toString()}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <label className="text-xs text-gray-500">Subjects (Optional)</label>
            <select
              multiple
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full min-h-[100px]"
              {...register("subjects")}
              defaultValue={data?.subjects?.map((s: any) => s.id) || []}
            >
              {SUBJECTS_LIST.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400">Hold Ctrl/Cmd to select multiple subjects</p>
            {errors.subjects?.message && (
              <p className="text-xs text-red-400">
                {errors.subjects.message.toString()}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <label
          className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer w-fit"
          htmlFor="img"
        >
          <Image src="/upload.png" alt="" width={28} height={28} />
          <span>Upload a photo (Optional)</span>
        </label>
        <input type="file" id="img" {...register("img")} className="hidden" accept="image/*" />
        {errors.img?.message && (
          <p className="text-xs text-red-400">
            {errors.img.message.toString()}
          </p>
        )}
      </div>
      
      <button 
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : (type === "create" ? "Create" : "Update")}
      </button>
    </form>
  );
};

export default TeacherForm;
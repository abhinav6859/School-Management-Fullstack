// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import InputField from "../InputField";
// import Image from "next/image";

// const schema = z.object({
//   username: z
//     .string()
//     .min(3, { message: "Username must be at least 3 characters long!" })
//     .max(20, { message: "Username must be at most 20 characters long!" }),
//   email: z.string().email({ message: "Invalid email address!" }),
//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters long!" }),
//   firstName: z.string().min(1, { message: "First name is required!" }),
//   lastName: z.string().min(1, { message: "Last name is required!" }),
//   phone: z.string().min(1, { message: "Phone is required!" }),
//   address: z.string().min(1, { message: "Address is required!" }),
//   bloodType: z.string().min(1, { message: "Blood Type is required!" }),
//   birthday: z.date({ message: "Birthday is required!" }),
//   sex: z.enum(["male", "female"], { message: "Sex is required!" }),
//   img: z.instanceof(File, { message: "Image is required" }),
// });

// type Inputs = z.infer<typeof schema>;

// const StudentForm = ({
//   type,
//   data,
// }: {
//   type: "create" | "update";
//   data?: any;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<Inputs>({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = handleSubmit((data) => {
//     console.log(data);
//   });

//   return (
//     <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">Create a new student</h1>
//       <span className="text-xs text-gray-400 font-medium">
//         Authentication Information
//       </span>
//       <div className="flex justify-between flex-wrap gap-4">
//         <InputField
//           label="Username"
//           name="username"
//           defaultValue={data?.username}
//           register={register}
//           error={errors?.username}
//         />
//         <InputField
//           label="Email"
//           name="email"
//           defaultValue={data?.email}
//           register={register}
//           error={errors?.email}
//         />
//         <InputField
//           label="Password"
//           name="password"
//           type="password"
//           defaultValue={data?.password}
//           register={register}
//           error={errors?.password}
//         />
//       </div>
//       <span className="text-xs text-gray-400 font-medium">
//         Personal Information
//       </span>
//       <div className="flex justify-between flex-wrap gap-4">
//         <InputField
//           label="First Name"
//           name="firstName"
//           defaultValue={data?.firstName}
//           register={register}
//           error={errors.firstName}
//         />
//         <InputField
//           label="Last Name"
//           name="lastName"
//           defaultValue={data?.lastName}
//           register={register}
//           error={errors.lastName}
//         />
//         <InputField
//           label="Phone"
//           name="phone"
//           defaultValue={data?.phone}
//           register={register}
//           error={errors.phone}
//         />
//         <InputField
//           label="Address"
//           name="address"
//           defaultValue={data?.address}
//           register={register}
//           error={errors.address}
//         />
//         <InputField
//           label="Blood Type"
//           name="bloodType"
//           defaultValue={data?.bloodType}
//           register={register}
//           error={errors.bloodType}
//         />
//         <InputField
//           label="Birthday"
//           name="birthday"
//           defaultValue={data?.birthday}
//           register={register}
//           error={errors.birthday}
//           type="date"
//         />
//         <div className="flex flex-col gap-2 w-full md:w-1/4">
//           <label className="text-xs text-gray-500">Sex</label>
//           <select
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             {...register("sex")}
//             defaultValue={data?.sex}
//           >
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//           {errors.sex?.message && (
//             <p className="text-xs text-red-400">
//               {errors.sex.message.toString()}
//             </p>
//           )}
//         </div>
//         <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
//           <label
//             className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
//             htmlFor="img"
//           >
//             <Image src="/upload.png" alt="" width={28} height={28} />
//             <span>Upload a photo</span>
//           </label>
//           <input type="file" id="img" {...register("img")} className="hidden" />
//           {errors.img?.message && (
//             <p className="text-xs text-red-400">
//               {errors.img.message.toString()}
//             </p>
//           )}
//         </div>
//       </div>
//       <button className="bg-blue-400 text-white p-2 rounded-md">
//         {type === "create" ? "Create" : "Update"}
//       </button>
//     </form>
//   );
// };

// export default StudentForm;



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
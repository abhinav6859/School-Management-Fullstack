"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// ✅ Dynamic Imports (expect DEFAULT exports)
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

// ✅ Form Mapping (safe)
const forms: Record<
  string,
  (type: "create" | "update", data?: any) => JSX.Element
> = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const [open, setOpen] = useState(false);

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  // ✅ Safe Form Renderer
  const renderForm = () => {
    if (type === "delete" && id) {
      return (
        <form className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center">
            Delete
          </button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      const formFn = forms[table];
      return formFn ? formFn(type, data) : <p>Form not found!</p>;
    }

    return <p>Invalid action</p>;
  };

  return (
    <>
      {/* BUTTON */}
      <button
        title={
          type === "create"
            ? `Add new ${table}`
            : type === "update"
            ? `Edit ${table}`
            : `Delete ${table}`
        }
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {/* ⚠️ Make sure these exist in /public */}
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            
            {renderForm()}

            {/* CLOSE BUTTON */}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
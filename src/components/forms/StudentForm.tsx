"use client";

export default function StudentForm({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {type === "create" ? "Create Student" : "Update Student"}
      </h2>
    </div>
  );
}
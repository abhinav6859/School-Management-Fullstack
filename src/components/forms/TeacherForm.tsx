"use client";

export default function TeacherForm({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {type === "create" ? "Create Teacher" : "Update Teacher"}
      </h2>
    </div>
  );
}
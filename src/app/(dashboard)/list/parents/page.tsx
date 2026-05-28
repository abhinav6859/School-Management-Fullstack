"use client";

import { useState } from "react";

import ParentForm from "@/components/forms/ParentForm";
import ParentList from "@/components/ParentList";

export default function ParentsPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-10">
      <ParentForm
        onParentAdded={() =>
          setRefresh((prev) => prev + 1)
        }
      />

      <ParentList refresh={refresh} />
    </div>
  );
}
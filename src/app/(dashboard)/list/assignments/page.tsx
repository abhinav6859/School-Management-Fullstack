"use client";

import { useState } from "react";

import AssignmentForm from "@/components/forms/AssignmentForm";

import AssignmentList from "@/components/list/AssignmentList";

import Table from "@/components/Table";
import Pagination from "@/components/Pagination";

export default function AssignmentsPage() {
  const [refresh, setRefresh] =
    useState(0);

  return (
    <div className="max-w-6xl mx-auto p-10">
      <AssignmentForm
        onAssignmentAdded={() =>
          setRefresh(
            (prev) => prev + 1
          )
        }
      />

      <AssignmentList
        refresh={refresh}
      />
      {/* <Table columns={columns} renderRow={renderRow} data={examsData} /> */}
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}
// types/student.ts

import { Prisma } from "@prisma/client";

export type Student = Prisma.StudentGetPayload<{
  include: {
    parent: true;
    class: true;
    grade: true;
  };
}>;

// types.ts
export interface FilterOptions {
  searchTerm: string;
  grade: string;
  class: string;
  sex: string;
}

export type SortField = "name" | "grade";
export type SortOrder = "asc" | "desc";

export interface ActiveModal {
  type: "update" | "delete";
  student: Student; // note: Student is defined elsewhere
}
// "use client";

// import { useState, useEffect } from "react";
// import FormModal from "@/components/FormModal";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { role } from "@/lib/data";
// import { Class, Subject, Teacher } from "@prisma/client";
// import Image from "next/image";
// import Link from "next/link";

// type TeacherList = Teacher & {
//   subjects: Subject[];
//   supervisedClasses: Class[];
// };

// const columns = [
//   {
//     header: "Info",
//     accessor: "info",
//   },
//   {
//     header: "Teacher ID",
//     accessor: "teacherId",
//     className: "hidden md:table-cell",
//   },
//   { 
//     header: "Subjects",
//     accessor: "subjects",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Classes",
//     accessor: "classes",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Phone",
//     accessor: "phone",
//     className: "hidden lg:table-cell",
//   },
//   {
//     header: "Address",
//     accessor: "address",
//     className: "hidden lg:table-cell",
//   },
//   {
//     header: "Actions",
//     accessor: "action",
//   },
// ];

// const renderRow = (item: TeacherList) => (
//   <tr
//     key={item.id}
//     className="border-b border-gray-200 even:bg-slate-50 hover:bg-lamaPurpleLight transition-colors duration-200"
//   >
//     <td className="py-3">
//       <Link
//         href={`/list/teachers/${item.id}`}
//         className="flex items-center gap-3 group"
//       >
//         <Image
//           src={item.img || "/noAvatar.png"}
//           alt={`${item.firstName} ${item.lastName}`}
//           width={40}
//           height={40}
//           className="rounded-full w-10 h-10 object-cover ring-2 ring-transparent group-hover:ring-lamaPurple transition-all duration-200"
//         />
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-800 group-hover:text-lamaPurple transition-colors">
//             {item.firstName} {item.lastName}
//           </span>
//           <span className="text-xs text-gray-500 md:hidden">
//             {item.email || "No email"}
//           </span>
//         </div>
//       </Link>
//     </td>
//     <td className="hidden md:table-cell font-mono text-sm text-gray-600">
//       {item.id}
//     </td>
//     <td className="hidden md:table-cell">
//       <div className="flex flex-wrap gap-1">
//         {item.subjects.map((subject, idx) => (
//           <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
//             {subject.name}
//           </span>
//         ))}
//       </div>
//     </td>
//     <td className="hidden md:table-cell">
//       <div className="flex flex-wrap gap-1">
//         {item.supervisedClasses.map((cls, idx) => (
//           <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
//             {cls.name}
//           </span>
//         ))}
//       </div>
//     </td>
//     <td className="hidden lg:table-cell">{item.phone || "—"}</td>
//     <td className="hidden lg:table-cell">{item.address || "—"}</td>
//     <td>
//       <div className="flex items-center gap-2">
//         <Link href={`/list/teachers/${item.id}`}>
//           <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaSky">
//             <Image src="/view.png" alt="View" width={16} height={16} />
//           </button>
//         </Link>
//         {role === "admin" && <FormModal table="teacher" type="delete" id={item.id} />}
//       </div>
//     </td>
//   </tr>
// );

// export default function TeacherListPage() {
//   const [teachers, setTeachers] = useState<TeacherList[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/teachers");
//         if (!res.ok) throw new Error("Failed to fetch");
//         const data = await res.json();
//         setTeachers(data);
//       } catch (err) {
//         setError("Unable to load teacher data");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeachers();
//   }, []);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl flex-1 m-4 mt-0 p-8">
//         <div className="flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl flex-1 m-4 mt-0 shadow-sm border border-gray-100 overflow-hidden">
//       <div className="p-5 border-b border-gray-100">
//         <div className="flex justify-between items-center">
//           <h1 className="text-xl font-bold">All Teachers ({teachers.length})</h1>
//           <div className="flex gap-2">
//             <TableSearch />
//             {role === "admin" && <FormModal table="teacher" type="create" />}
//           </div>
//         </div>
//       </div>

//       {error ? (
//         <div className="p-5 text-center text-red-600">{error}</div>
//       ) : teachers.length === 0 ? (
//         <div className="p-5 text-center text-gray-500">No teachers found</div>
//       ) : (
//         <>
//           <Table columns={columns} renderRow={renderRow} data={teachers} />
//           <div className="p-5 border-t border-gray-100">
//             <Pagination />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import TeacherForm from "@/components/forms/TeacherForm";
import TeacherList from "@/components/TeacherList";

export default function TeachersPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-10">
      <TeacherForm
        onTeacherAdded={() => setRefresh((prev) => prev + 1)}
      />

      <TeacherList refresh={refresh} />
    </div>
  );
}
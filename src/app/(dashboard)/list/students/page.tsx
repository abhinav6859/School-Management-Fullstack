// import FormModal from "@/components/FormModal";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import { role } from "@/lib/data";
// import { prisma } from "@/lib/prisma";
// import { Student, Result, Grade, Class } from "@prisma/client";
// import Image from "next/image";
// import Link from "next/link";

// // ✅ Fixed: Proper type based on your Prisma schema
// type StudentList = Student & {
//   results: Result[];
//   grade: Grade;      // gradeId is Int (required)
//   class: Class;      // classId is Int (required)
// };

// const columns = [
//   {
//     header: "Info",
//     accessor: "info",
//   },
//   {
//     header: "Student ID",
//     accessor: "studentId",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Grade",
//     accessor: "grade",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Class",
//     accessor: "class",
//     className: "hidden md:table-cell",
//   },
//   {
//     header: "Phone",
//     accessor: "phone",
//     className: "hidden lg:table-cell",
//   },
//   {
//     header: "Blood Type",
//     accessor: "bloodType",
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

// const renderRow = (item: StudentList) => {
//   // Format birthday for display if needed
//   const formattedBirthday = new Date(item.birthday).toLocaleDateString();
  
//   return (
//     <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-colors duration-200"
//     >
//       {/* INFO CELL - with improved design */}
//       <td className="flex items-center gap-3 p-4">
//         <Link
//           href={`/list/students/${item.id}`}
//           aria-label={`View details of ${item.firstName} ${item.lastName}`}
//           title="View Details"
//           className="relative group"
//         >
//           <div className="relative">
//             <Image
//               src={item.img || "/avatar.png"}
//               alt={`${item.firstName} ${item.lastName}`}
//               width={44}
//               height={44}
//               className="rounded-full w-11 h-11 object-cover ring-2 ring-gray-100 group-hover:ring-lamaSky transition-all duration-200"
//             />
//             <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
//           </div>
//         </Link>
        
//         <div className="ml-2">
//           <div className="flex items-center gap-2">
//             <span className="font-semibold text-gray-800 hover:text-lamaSky transition-colors">
//               <Link href={`/list/students/${item.id}`}>
//                 {item.firstName} {item.lastName}
//               </Link>
//             </span>
//             {item.sex && (
//               <span className={`text-xs px-1.5 py-0.5 rounded-full ${
//                 item.sex === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
//               }`}>
//                 {item.sex}
//               </span>
//             )}
//           </div>
          
//           {/* Mobile view info */}
//           <div className="text-xs text-gray-500 block md:hidden mt-1 space-y-0.5">
//             <div className="flex items-center gap-1">
//               <span className="font-medium">ID:</span> {item.username || item.id.slice(-6)}
//             </div>
//             <div className="flex items-center gap-1">
//               <span className="font-medium">Grade:</span> {item.grade?.level || '-'}
//             </div>
//           </div>
//         </div>
//       </td>

//       {/* STUDENT ID / USERNAME */}
//       <td className="hidden md:table-cell font-mono text-xs text-gray-600">
//         {item.username || item.id.slice(-8)}
//       </td>
      
//       {/* GRADE - FIXED: Access grade level/name */}
//       <td className="hidden md:table-cell">
//         <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
//           {item.grade?.level || `Grade ${item.gradeId}`}
//         </span>
//       </td>
      
//       {/* CLASS */}
//       <td className="hidden md:table-cell">
//         <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
//           {item.class?.name || `Class ${item.classId}`}
//         </span>
//       </td>
      
//       {/* PHONE */}
//       <td className="hidden lg:table-cell">
//         {item.phone ? (
//           <a href={`tel:${item.phone}`} className="hover:text-lamaSky transition-colors">
//             {item.phone}
//           </a>
//         ) : '-'}
//       </td>
      
//       {/* BLOOD TYPE */}
//       <td className="hidden lg:table-cell">
//         {item.bloodType ? (
//           <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
//             {item.bloodType}
//           </span>
//         ) : '-'}
//       </td>
      
//       {/* ADDRESS */}
//       <td className="hidden lg:table-cell max-w-xs truncate" title={item.address || ''}>
//         {item.address || '-'}
//       </td>
      
//       {/* ACTIONS */}
//       <td>
//         <div className="flex items-center gap-2">
//           <Link href={`/list/students/${item.id}`}>
//             <button 
//               aria-label={`View details of ${item.firstName} ${item.lastName}`}
//               title="View Details"
//               className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaSky hover:bg-lamaSky/80 transition-all duration-200 hover:scale-110"
//             >
//               <Image src="/view.png" alt="View" width={16} height={16} />
//             </button>
//           </Link>
          
//           {role === "admin" && (
//             <>
//               <button 
//                 aria-label={`Edit ${item.firstName} ${item.lastName}`}
//                 title="Edit Student"
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow hover:bg-lamaYellow/80 transition-all duration-200 hover:scale-110"
//               >
//                 <Image src="/edit.png" alt="Edit" width={16} height={16} />
//               </button>
//               <FormModal table="student" type="delete" id={item.id} />
//             </>
//           )}
//         </div>
//       </td>
//     </tr>
//   );
// };

// const StudentListPage = async () => {
//   // ✅ Fixed: Include all relations from your schema
//   const students = await prisma.student.findMany({
//     include: {
//       results: true,
//       grade: true,    // Grade relation (required - has level field)
//       class: true,    // Class relation (required - has name field)
//       parent: true,   // Optional: include parent info
//       attendances: {  // Optional: include attendance count
//         take: 10,
//       },
//     },
//     orderBy: {
//       createdAt: 'desc'
//     },
   
//   });

//   // Calculate statistics for UI improvement
//   const totalStudents = students.length;
//   const maleCount = students.filter(s => s.sex === 'MALE').length;
//   const femaleCount = students.filter(s => s.sex === 'FEMALE').length;

//   return (
//     <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl flex-1 m-4 mt-0 shadow-lg border border-gray-100">
      
//       {/* 🔝 TOP SECTION - IMPROVED UI */}
//       <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
//         <div className="space-y-1">
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             Students
//             <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
//               {totalStudents}
//             </span>
//           </h1>
//           <div className="flex items-center gap-3 text-sm text-gray-500">
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-blue-500" />
//               <span>Male: {maleCount}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-pink-500" />
//               <span>Female: {femaleCount}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
//           {/* SEARCH - Improved */}
//           <div className="w-full sm:w-auto">
//             <TableSearch />
//           </div>

//           {/* ACTION BUTTONS - Improved layout */}
//           <div className="flex items-center gap-2">
//             <button
//               aria-label="Filter students"
//               title="Filter"
//               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
//             >
//               <Image src="/filter.png" alt="Filter" width={18} height={18} />
//             </button>

//             <button
//               aria-label="Sort students"
//               title="Sort"
//               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
//             >
//               <Image src="/sort.png" alt="Sort" width={18} height={18} />
//             </button>

//             <button
//               aria-label="Export data"
//               title="Export to Excel"
//               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
//             >
//               <Image src="/export.png" alt="Export" width={18} height={18} />
//             </button>

//             {role === "admin" && (
//               <FormModal table="student" type="create" />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 📊 STATS CARDS - New UI improvement */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//         <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl">
//           <p className="text-xs text-blue-600 font-medium">Total Students</p>
//           <p className="text-2xl font-bold text-blue-700">{totalStudents}</p>
//         </div>
//         <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl">
//           <p className="text-xs text-green-600 font-medium">Avg. Per Class</p>
//           <p className="text-2xl font-bold text-green-700">
//             {Math.round(totalStudents / (students[0]?.classId ? 
//               new Set(students.map(s => s.classId)).size : 1))}
//           </p>
//         </div>
//         <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl">
//           <p className="text-xs text-purple-600 font-medium">Active Students</p>
//           <p className="text-2xl font-bold text-purple-700">{totalStudents}</p>
//         </div>
//         <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-xl">
//           <p className="text-xs text-orange-600 font-medium">This Month</p>
//           <p className="text-2xl font-bold text-orange-700">
//             {students.filter(s => new Date(s.createdAt).getMonth() === new Date().getMonth()).length}
//           </p>
//         </div>
//       </div>

//       {/* 📋 LIST TABLE - Improved with better styling */}
//       <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
//         <Table columns={columns} renderRow={renderRow} data={students} />
//       </div>

//       {/* 📄 PAGINATION - Improved */}
//       <div className="mt-6 flex items-center justify-between">
//         <p className="text-sm text-gray-500">
//           Showing {Math.min(10, students.length)} of {students.length} students
//         </p>
//         <Pagination />
//       </div>
//     </div>
//   );
// };

// export default StudentListPage;























"use client";

import { useState } from "react";

import StudentForm from "@/components/forms/StudentForm";
import StudentList from "@/components/StudentList";

export default function StudentsPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-10">
      <StudentForm
        onStudentAdded={() =>
          setRefresh((prev) => prev + 1)
        }
      />

      <StudentList refresh={refresh} />
    </div>
  );
}
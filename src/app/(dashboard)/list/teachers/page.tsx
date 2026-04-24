"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Teacher = {
  id: number;
  name: string;
  teacherId: string;
  email?: string;
 photo: string;
  subjects: string[];
  classes: string[];
  phone: string;
  address: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];


const TeacherListpage = () => {

const renderRow = (item: Teacher) => (
  <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
    <td>
   <Link
  href={`/list/teachers/${item.id}`}
  aria-label={`View details of ${item.name}`}
  title="View Details"
  className="block"
>
  <Image
    src={item.photo || "/avatar.png"}
    alt={item.name}
    width={40}
    height={40}
    className="rounded-full w-10 h-10 object-cover hover:shadow-md transition-all"
  />
</Link>

      {/* <Image src={item.photo} alt={item.name} width={40} height={40} className="rounded-full md:hidden xl:block w-10 hover:shadow-md" /> */}
    
      <div className="ml-3">
        <span className="font-medium text-gray-800">{item.name}</span>
        <span className="text-xs text-gray-500 block md:hidden">{item?.email}</span>
        <span className="text-xs text-gray-500 block md:hidden">{item.teacherId}</span>
      </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">{item.subjects.join(", ")}</td>
      <td className="hidden md:table-cell">{item.classes.join(", ")}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
          <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button 
            aria-label={`View details of ${item.name}`}
            title="View Details"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
  <>
    {/* <button 
      aria-label={`Edit details of ${item.name}`}
      title="Edit Details"
      className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple"
    >
      <Image src="/delete.png" alt="" width={16} height={16} />
    </button> */}

    <FormModal table="teacher" type="delete" id={item.id} />
  </>
)}
        </div>
      </td>
  </tr>
);


  return (
    <div className="bg-white p-5 rounded-xl flex-1 m-4 mt-0 shadow-sm border border-gray-100">
      
      {/* 🔝 TOP */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-xl font-semibold text-gray-800">
          All Teachers
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          
          {/* SEARCH */}
          <TableSearch />

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 self-end">
            
            {/* FILTER */}
            <button
              aria-label="Filter teachers"
              title="Filter"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 transition-all shadow-sm"
            >
              <Image src="/filter.png" alt="Filter" width={16} height={16} />
            </button>

            {/* SORT */}
            <button
              aria-label="Sort teachers"
              title="Sort"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 transition-all shadow-sm"
            >
              <Image src="/sort.png" alt="Sort" width={16} height={16} />
            </button>

            {/* ADD */}
            {role === "admin" && (
              <button
             
                aria-label="Add teacher"
                title="Add Teacher"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-500 hover:bg-purple-600 transition-all shadow-md"
              >
                <Image src="/plus.png" alt="Add" width={16} height={16} />
              </button>
              // <FormModal table="teacher" type="create"/>
            )}
          </div>
        </div>
      </div>

      {/* 📋 LIST */}
      <div className="mt-4">
        <Table columns={columns} renderRow={renderRow} data={teachersData} />
      </div>

      {/* 📄 PAGINATION */}
      <div className="mt-6">
        <Pagination />
      </div>
    </div>
  );
};

export default TeacherListpage;
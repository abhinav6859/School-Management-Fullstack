import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { Class, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type TeacherList = Teacher & {
  subjects: Subject[];
  supervisedClasses: Class[];
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

// Move renderRow outside of the main component to avoid recreation
const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 hover:bg-lamaPurpleLight transition-colors duration-200"
  >
    {/* Teacher Info with Profile Link */}
    <td className="py-3">
      <Link
        href={`/list/teachers/${item.id}`}
        aria-label={`View details of ${item.firstName} ${item.lastName}`}
        title="View Details"
        className="flex items-center gap-3 group"
      >
        <div className="relative">
          <Image
            src={item.img || "/noAvatar.png"}
            alt={`${item.firstName} ${item.lastName}`}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover ring-2 ring-transparent group-hover:ring-lamaPurple transition-all duration-200"
          />
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        </div>
        
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 group-hover:text-lamaPurple transition-colors">
            {item.firstName} {item.lastName}
          </span>
          <span className="text-xs text-gray-500 md:hidden">
            {item.email || "No email"}
          </span>
          <span className="text-xs text-gray-400 md:hidden">
            ID: {item.id}
          </span>
        </div>
      </Link>
    </td>

    {/* Teacher ID */}
    <td className="hidden md:table-cell font-mono text-sm text-gray-600">
      {item.id}
    </td>

    {/* Subjects */}
    <td className="hidden md:table-cell">
      <div className="flex flex-wrap gap-1 max-w-xs">
        {item.subjects.length > 0 ? (
          item.subjects.map((subject, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
            >
              {subject.name}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </div>
    </td>

    {/* Classes */}
    <td className="hidden md:table-cell">
      <div className="flex flex-wrap gap-1 max-w-xs">
        {item.supervisedClasses.length > 0 ? (
          item.supervisedClasses.map((cls, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
            >
              {cls.name}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </div>
    </td>

    {/* Phone */}
    <td className="hidden lg:table-cell text-gray-600">
      {item.phone || <span className="text-gray-400">—</span>}
    </td>

    {/* Address */}
    <td className="hidden lg:table-cell text-gray-600 max-w-xs truncate">
      {item.address || <span className="text-gray-400">—</span>}
    </td>

    {/* Actions */}
    <td>
      <div className="flex items-center gap-2">
        <Link
          href={`/list/teachers/${item.id}`}
          aria-label={`View details of ${item.firstName} ${item.lastName}`}
          title="View Details"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaSky hover:bg-lamaSky/80 transition-all duration-200 hover:scale-110"
        >
          <Image src="/view.png" alt="View" width={16} height={16} />
        </Link>
        
        {role === "admin" && (
          <FormModal table="teacher" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

// Main component - make sure it's properly exported
export default async function TeacherListPage() {
  // Fetch teachers with proper error handling
  let teachers: TeacherList[] = [];
  let error = null;

  try {
    const fetchedTeachers = await prisma.teacher.findMany({
      include: {
        subjects: {
          select: {
            name: true,
          },
        },
        supervisedClasses: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });
    teachers = fetchedTeachers as TeacherList[];
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
    error = "Unable to load teacher data. Please try again later.";
  }

  return (
    <div className="bg-white rounded-xl flex-1 m-4 mt-0 shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            All Teachers
            {teachers.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({teachers.length})
              </span>
            )}
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <TableSearch />
            
            <div className="flex items-center gap-2">
              <button
                aria-label="Filter teachers"
                title="Filter"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <Image src="/filter.png" alt="Filter" width={16} height={16} />
              </button>

              <button
                aria-label="Sort teachers"
                title="Sort"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <Image src="/sort.png" alt="Sort" width={16} height={16} />
              </button>

              {role === "admin" && (
                <FormModal table="teacher" type="create" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-5">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!error && teachers.length === 0 && (
        <div className="p-5">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No teachers found</p>
            {role === "admin" && (
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Add your first teacher
              </button>
            )}
          </div>
        </div>
      )}

      {/* Data Table */}
      {!error && teachers.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Table columns={columns} renderRow={renderRow} data={teachers} />
          </div>

          {/* Pagination */}
          <div className="p-5 border-t border-gray-100">
            <Pagination />
          </div>
        </>
      )}
    </div>
  );
}
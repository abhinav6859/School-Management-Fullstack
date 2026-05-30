"use client";

import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import Table from "../Table";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import { Class, Subject } from "@prisma/client";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { role } from "@/lib/data";
import { useToast } from "@/components/ToastProvider";

interface Teacher {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone?: string | null;
  address?: string | null;
  img?: string | null;
}

type TeacherListType = Teacher & {
  subjects?: Subject[];
  supervisedClasses?: Class[];
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Username",
    accessor: "username",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden lg:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden lg:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden xl:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "text-center",
  },
];

const renderRow = (item: TeacherListType) => (
  <tr
    key={item.id}
    className="border-b border-gray-100 even:bg-gray-50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 group"
  >
    <td className="py-4 px-2">
      <Link
        href={`/list/teachers/${item.id}`}
        className="flex items-center gap-3"
      >
        <div className="relative">
          <Image
            src={item.img || "/noAvatar.png"}
            alt="teacher"
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-purple-200 transition-all"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-1 ring-white"></span>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-gray-400">{item.email}</p>
        </div>
      </Link>
    </td>

    <td className="hidden md:table-cell px-2">
      <span className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
        {item.username}
      </span>
    </td>

    <td className="hidden lg:table-cell px-2">
      <div className="flex flex-wrap gap-1.5">
        {item.subjects?.length ? (
          item.subjects.slice(0, 3).map((subject) => (
            <span
              key={subject.id}
              className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full border border-blue-200"
            >
              {subject.name}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs italic">No Subjects</span>
        )}
        {item.subjects && item.subjects.length > 3 && (
          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            +{item.subjects.length - 3}
          </span>
        )}
      </div>
    </td>

    <td className="hidden lg:table-cell px-2">
      <div className="flex flex-wrap gap-1.5">
        {item.supervisedClasses?.length ? (
          item.supervisedClasses.slice(0, 3).map((cls) => (
            <span
              key={cls.id}
              className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-full border border-green-200"
            >
              {cls.name}
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-xs italic">No Classes</span>
        )}
        {item.supervisedClasses && item.supervisedClasses.length > 3 && (
          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            +{item.supervisedClasses.length - 3}
          </span>
        )}
      </div>
    </td>

    <td className="hidden xl:table-cell px-2">
      <div className="flex items-center gap-2">
        {item.phone ? (
          <>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm text-gray-600">{item.phone}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400 italic">—</span>
        )}
      </div>
    </td>

    <td className="hidden xl:table-cell px-2">
      <div className="flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm text-gray-600 truncate max-w-[200px]">
          {item.address || <span className="italic text-gray-400">—</span>}
        </span>
      </div>
    </td>

    <td className="px-2">
      <div className="flex items-center justify-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-purple-100 hover:scale-110 transition-all duration-200 group/btn">
            <svg className="w-4 h-4 text-gray-600 group-hover/btn:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </Link>

        {role === "admin" && (
          <FormModal
            table="teacher"
            type="delete"
            id={item.id}
          />
        )}
      </div>
    </td>
  </tr>
);

export default function TeacherList({
  refresh,
}: {
  refresh: number;
}) {
  const [teachers, setTeachers] = useState<TeacherListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/teachers");
      const result = await response.json();

      // Handle response based on API structure
      if (response.ok && (result.success || Array.isArray(result))) {
        const teachersData = result.data || result;
        setTeachers(teachersData);
        
        // Success toast (optional - only show on refresh/important updates)
        if (refresh > 0) {
          showToast(`Loaded ${teachersData.length} teachers successfully`, "success");
        }
      } else {
        const errorMessage = result.message || "Failed to fetch teachers";
        setError(errorMessage);
        showToast(errorMessage, "error");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = "Unable to connect to the server";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [refresh]);

  // Listen for teacher creation/update/deletion events from FormModal
  useEffect(() => {
    const handleTeacherUpdate = () => {
      fetchTeachers();
      showToast("Teacher list has been updated", "success");
    };

    window.addEventListener("teacherCreated", handleTeacherUpdate);
    window.addEventListener("teacherUpdated", handleTeacherUpdate);
    window.addEventListener("teacherDeleted", handleTeacherUpdate);

    return () => {
      window.removeEventListener("teacherCreated", handleTeacherUpdate);
      window.removeEventListener("teacherUpdated", handleTeacherUpdate);
      window.removeEventListener("teacherDeleted", handleTeacherUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
          </div>
          <p className="text-sm text-gray-500">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Teachers List
              <div className="inline-block ml-3 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-full">
                {teachers.length} Total
              </div>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and view all teaching staff
            </p>
          </div>

          <div className="flex items-center gap-3">
            <TableSearch onSearch={async (searchTerm) => {
              if (!searchTerm) {
                await fetchTeachers();
              } else {
                try {
                  setLoading(true);
                  const response = await fetch(`/api/teachers?search=${encodeURIComponent(searchTerm)}`);
                  const result = await response.json();
                  
                  if (response.ok && (result.success || Array.isArray(result))) {
                    const teachersData = result.data || result;
                    setTeachers(teachersData);
                    
                    if (teachersData.length === 0) {
                      showToast(`No teachers found matching "${searchTerm}"`, "info");
                    } else {
                      showToast(`Found ${teachersData.length} teacher(s) matching "${searchTerm}"`, "success");
                    }
                  } else {
                    showToast(result.message || "Search failed", "error");
                  }
                } catch (err) {
                  showToast("Search failed. Please try again.", "error");
                } finally {
                  setLoading(false);
                }
              }
            }} />
            {role === "admin" && (
              <FormModal
                table="teacher"
                type="create"
                onSuccess={() => {
                  fetchTeachers();
                  showToast("New teacher added successfully", "success");
                }}
                onError={(errorMsg) => {
                  showToast(errorMsg || "Failed to add teacher", "error");
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {error ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => fetchTeachers()}
            className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No teachers found</p>
          <p className="text-sm text-gray-400 mt-1">Get started by adding your first teacher</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              renderRow={renderRow}
              data={teachers}
            />
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{teachers.length}</span> teachers
              </div>
              <Pagination />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
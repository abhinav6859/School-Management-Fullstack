// app/list/teachers/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import BigCalender from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Announcement from "@/components/Announcements";
import { useToast } from "@/components/ToastProvider";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";

// Types
interface Subject {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  students?: { id: string }[];
}

interface TeacherDetails {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone?: string | null;
  address?: string | null;
  bloodType?: string | null;
  img?: string | null;
  createdAt: string;
  subjects: Subject[];
  supervisedClasses: Class[];
  totalStudents: number;
  totalClasses: number;
  // experience?: number; // uncomment when you have joinDate
}

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teachers/${teacherId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setTeacher(result.data);
        } else {
          setError(result.message || "Failed to load teacher details");
          showToast(result.message || "Failed to load teacher details", "error");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the server");
        showToast("Unable to connect to the server", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [teacherId, showToast]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast("Teacher deleted successfully", "success");
        router.push("/list/teachers");
      } else {
        showToast(result.message || "Failed to delete teacher", "error");
      }
    } catch (err) {
      showToast("Failed to delete teacher", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium">{error || "Teacher not found"}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const teacherImage = teacher.img || "/noAvatar.png";

  return (
    <div className="flex-1 p-4 flex flex-col gap-6 xl:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* LEFT SIDE */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        
        {/* PROFILE CARD - Enhanced */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <Image
                src={teacherImage}
                alt={fullName}
                width={120}
                height={120}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-purple-100"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full ring-2 ring-white"></span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {fullName}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">@{teacher.username}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full w-fit">
                  Active Teacher
                </span>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{teacher.email}</span>
                </div>
                {teacher.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{teacher.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STATS SECTION - Dynamic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-500">Classes</h2>
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-2xl font-semibold mt-2">{teacher.totalClasses}</p>
            <p className="text-xs text-gray-400 mt-1">Currently Teaching</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-500">Students</h2>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-2xl font-semibold mt-2">{teacher.totalStudents}</p>
            <p className="text-xs text-gray-400 mt-1">Across all classes</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-500">Subjects</h2>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-2xl font-semibold mt-2">{teacher.subjects.length}</p>
            <p className="text-xs text-gray-400 mt-1">Specialized subjects</p>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Weekly Schedule
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Class schedule for {fullName}
          </p>
          <BigCalender />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        
        {/* ABOUT */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {fullName} is a dedicated educator with expertise in {teacher.subjects.map(s => s.name).join(", ") || "various subjects"}.
            They currently teach {teacher.totalClasses} classes and mentor {teacher.totalStudents} students.
            {teacher.bloodType && ` Blood type: ${teacher.bloodType}.`}
          </p>
        </div>

        {/* CONTACT INFO */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-20">Email:</span>
              <span className="text-gray-800">{teacher.email}</span>
            </div>
            {teacher.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-20">Phone:</span>
                <span className="text-gray-800">{teacher.phone}</span>
              </div>
            )}
            {teacher.address && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-20">Address:</span>
                <span className="text-gray-800">{teacher.address}</span>
              </div>
            )}
            {teacher.bloodType && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-20">Blood Type:</span>
                <span className="text-gray-800">{teacher.bloodType}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-20">Gender:</span>
              <span className="text-gray-800">{teacher.gender}</span>
            </div>
          </div>
        </div>

        {/* SUBJECTS & CLASSES */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Subjects & Classes
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Subjects Taught</p>
              <div className="flex flex-wrap gap-1.5">
                {teacher.subjects.length > 0 ? (
                  teacher.subjects.map(subject => (
                    <span key={subject.id} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                      {subject.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No subjects assigned</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Supervised Classes</p>
              <div className="flex flex-wrap gap-1.5">
                {teacher.supervisedClasses.length > 0 ? (
                  teacher.supervisedClasses.map(cls => (
                    <span key={cls.id} className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                      {cls.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No classes assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {role === "admin" && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
            <FormModal
              table="teacher"
              type="update"
              id={teacher.id}
              data={{
                username: teacher.username,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                phone: teacher.phone,
                address: teacher.address,
                gender: teacher.gender,
                bloodType: teacher.bloodType,
              }}
              onSuccess={() => {
                // Refresh the page data
                window.location.reload();
              }}
            />
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}

        <Performance />
        <Announcement />
      </div>
    </div>
  );
}
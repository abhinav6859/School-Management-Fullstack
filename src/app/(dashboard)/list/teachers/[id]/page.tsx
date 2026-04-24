"use client";

import { teachersData } from "@/lib/data";
import Bigcalender from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Announcement from "@/components/Announcements";


type Teacher = {
  id: number;
  name: string;
  teacherId: string;
  email?: string;
  photo: string;
};

const Page = ({ params }: { params: { id: string } }) => {
  const teacherId = Number(params.id);

  const teacher = teachersData.find((t) => t.id === teacherId);

  if (!teacher) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        Teacher not found 😢
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-6 xl:flex-row">
      
      {/* LEFT SIDE */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        
        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6">
          <img
            src={teacher.photo}
            alt={teacher.name}
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{teacher.name}</h1>
            <p className="text-gray-500">ID: {teacher.teacherId}</p>
            <p className="text-gray-500">{teacher.email}</p>

            <span className="mt-2 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full w-fit">
              Active Teacher
            </span>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-sm text-gray-500">Classes</h2>
            <p className="text-xl font-semibold">12</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-sm text-gray-500">Students</h2>
            <p className="text-xl font-semibold">320</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-sm text-gray-500">Experience</h2>
            <p className="text-xl font-semibold">5 Years</p>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-lg font-semibold mb-2">
            Schedule ({teacher.name})
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            {teacher.email}
          </p>

          <Bigcalender />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        
        {/* ABOUT */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-600">
            {teacher.name} is a dedicated educator with a passion for teaching and mentoring students.
            Known for interactive classes and strong subject knowledge.
          </p>
        </div>

        {/* CONTACT */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Contact Info</h2>
          <p className="text-sm text-gray-600">📧 {teacher.email}</p>
          <p className="text-sm text-gray-600">📞 +91 98765 43210</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex gap-3">
          <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Edit
          </button>
          <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
        <Performance />
<Announcement />
      </div>
    </div>
  );
};

export default Page;
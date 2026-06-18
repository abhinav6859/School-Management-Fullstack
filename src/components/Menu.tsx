"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Role = "admin" | "teacher" | "student" | "parent";

interface MenuProps {
  role: Role;
}

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/more.png",
        label: "grades",
        href: "/list/grades",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = ({ role }: MenuProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`h-0.5 bg-gray-700 transition-all ${
              isMobileMenuOpen
                ? "rotate-45 translate-y-2"
                : ""
            }`}
          />
          <span
            className={`h-0.5 bg-gray-700 transition-all ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 bg-gray-700 transition-all ${
              isMobileMenuOpen
                ? "-rotate-45 -translate-y-2"
                : ""
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-white shadow-xl lg:shadow-none z-50 transition-transform duration-300 overflow-y-auto
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        w-64`}
      >
        <div className="p-4 mt-14 lg:mt-0">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-8">
              <h3 className="text-xs uppercase font-semibold text-gray-400 mb-3 px-3">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items
                  .filter((item) => item.visible.includes(role))
                  .map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() =>
                          setIsMobileMenuOpen(false)
                        }
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                        ${
                          active
                            ? "bg-sky-100 text-sky-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={20}
                          height={20}
                        />

                        <span>{item.label}</span>

                        {active && (
                          <div className="ml-auto w-1 h-6 bg-sky-500 rounded-full" />
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Menu;
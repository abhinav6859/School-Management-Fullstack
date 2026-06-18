// app/(dashboard)/layout.tsx
"use client";

import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "teacher" | "student" | "parent">("admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token || !userRole) {
      router.push("/sign-in");
      return;
    }

    // Set role (convert to lowercase for Menu component)
    setRole(userRole.toLowerCase() as any);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">SchooLama</span>
        </Link>
        <Menu role={role} />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar role={role} />
        {children}
      </div>
    </div>
  );
}
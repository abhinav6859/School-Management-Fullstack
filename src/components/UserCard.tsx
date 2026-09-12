// components/UserCard.tsx
"use client";

interface UserCardProps {
  type: "student" | "teacher" | "parent" | "admin"; // tighter typing
  count?: number;
  year?: string;
  loading?: boolean;
}

const UserCard = ({
  type,
  count = 0,
  year = new Date().getFullYear().toString(),
  loading = false,
}: UserCardProps) => {
  const colorMap: Record<UserCardProps["type"], string> = {
    student: "from-blue-500 to-blue-600",
    teacher: "from-purple-500 to-purple-600",
    parent: "from-yellow-500 to-yellow-600",
    admin: "from-red-500 to-red-600",
  };

  const labelMap: Record<UserCardProps["type"], string> = {
    student: "Students",
    teacher: "Teachers",
    parent: "Parents",
    admin: "Admins",
  };

  const colorClass = colorMap[type] || "from-gray-500 to-gray-600";
  const label = labelMap[type] || type;

  if (loading) {
    return (
      <div className="rounded-2xl p-4 flex-1 min-w-[130px] bg-gray-100 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded my-4" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-4 flex-1 min-w-[130px] bg-gradient-to-br ${colorClass} text-white shadow-md hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white">
          {year}
        </span>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {/* optional icon */}
        </div>
      </div>
      <h1 className="text-2xl font-semibold my-2">
        {count.toLocaleString()}
      </h1>
      <h2 className="capitalize text-sm font-medium text-white/80">
        {label}
      </h2>
    </div>
  );
};

export default UserCard;

import { Role } from "@/app/(dashboard)/layout";
import Image from "next/image";

import  Link  from "next/link";
interface MenuItem { icon: string; label: string; href: string; visible: string[]; }
interface MenuSection {
  title: string;
  items: MenuItem[];
}
interface ComponentsProps {section: MenuSection, role: Role, handleLinkClick: () => void, isActive:  (href:string) => boolean};


export default function Components({
  section,
  role,
  handleLinkClick,
  isActive,
}: ComponentsProps) {
  return (
    <div key={section.title} className="mb-8">
      <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {section.title}
      </h3>

      <div className="space-y-1">
        {section.items
          .filter((item:any) => item.visible.includes(role))
          .map((item:any) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                          flex items-center gap-3 rounded-lg px-3 py-3 
                          transition-all duration-200
                          hover:scale-[1.02] active:scale-[0.98]
                          ${
                            active
                              ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                              : "text-gray-600 hover:bg-gray-100 hover:text-sky-600"
                          }
                        `}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                  loading="lazy"
                />

                <span className="flex-1 text-sm">{item.label}</span>

                {active && (
                  <div className="h-6 w-1 rounded-full bg-sky-500 flex-shrink-0" />
                )}
              </Link>
            );
          })}
      </div>
    </div>
  );
}

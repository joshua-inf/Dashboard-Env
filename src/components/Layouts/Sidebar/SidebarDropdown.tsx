import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { MenuItem, SidebarItemProps } from "@/types/layout";


interface SidebarItemProp extends Partial<SidebarItemProps> {
  item: MenuItem[]
}


const SidebarDropdown: React.FC<SidebarItemProp> = ({ item, withIcons = false }) => {
  const pathname = usePathname();

  return (
    <div className="mt-2 space-y-1 pl-4">
      {item.map((child, index) => {
        const isActive = pathname === child.route;

        return (
          <Link
            key={index}
            href={child.route ?? "#"}
            className={`
              group relative flex items-center justify-between px-3 py-2.5 rounded-lg 
              transition-all duration-200 ease-out
              ${isActive
                ? "bg-gradient-to-r from-blue-50 to-blue-25 dark:from-blue-900/20 dark:to-blue-800/10 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500 shadow-sm"
                : "text-gray-600 dark:text-gray-400  hover:bg-gray-100/60 dark:hover:bg-gray-700/60 border-l-2 border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Icon or dot indicator */}
              {withIcons && child.icon ? (
                <div className={`
                  p-1.5 rounded-md transition-colors duration-200
                  ${isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-400  "
                  }
                `}>
                  {React.cloneElement(child.icon as React.ReactElement, {
                    className: "w-3.5 h-3.5"
                  })}
                </div>
              ) : (
                <div className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${isActive
                    ? "bg-blue-500 scale-100"
                    : "bg-gray-300 "
                  }
                `} />
              )}

              <span className={`
                text-sm font-medium transition-all duration-200
                ${isActive ? "font-semibold translate-x-0.5" : "font-normal"}
              `}>
                {child.label}
              </span>
            </div>

            {/* Right side indicators */}
            <div className="flex items-center gap-1.5">
              {child.badge && (
                <span className={`
                  px-1.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide transition-all duration-200
                  ${isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 shadow-xs"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                  }
                `}>
                  {child.badge}
                </span>
              )}

              <ChevronRightIcon className={`
                w-3 h-3 transition-all duration-200
                ${isActive
                  ? "text-blue-500 opacity-100 scale-100"
                  : "text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                }
              `} />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarDropdown;
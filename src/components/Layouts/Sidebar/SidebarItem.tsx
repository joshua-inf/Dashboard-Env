import React, { useState, useEffect } from "react";
import Link from "next/link";
import SidebarDropdown from "../Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { MenuItem, SidebarItemProps } from "@/types/layout";



interface SidebarItemProp extends Omit<SidebarItemProps, "item"> {
  item: MenuItem
}

const SidebarItem = ({ item, pageName, setPageName }: SidebarItemProp) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);
  const pathname = usePathname();

  const isActive = (menuItem: MenuItem): boolean => {
    if (menuItem.route === pathname) return true;
    if (menuItem.children) {
      return menuItem.children.some((child) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);
  const hasChildren = item.children && item.children.length > 0;
  const isCurrentlyExpanded = pageName === item.label.toLowerCase();

  // Handle animation states
  useEffect(() => {
    if (isCurrentlyExpanded) {
      setShouldRenderChildren(true);
      const timer = setTimeout(() => setIsExpanded(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
      const timer = setTimeout(() => setShouldRenderChildren(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isCurrentlyExpanded]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      const updatedPageName = !isCurrentlyExpanded ? item.label.toLowerCase() : "";
      setPageName(updatedPageName);
    } else {
      setPageName(item.label.toLowerCase());
    }
  };

  return (
    <li className="relative">
      <Link
        href={hasChildren ? "#" : item.route ?? "#"}
        onClick={handleClick}
        className={`
          group flex items-center justify-between gap-3 px-3 py-3 rounded-xl 
          transition-all duration-300 ease-out relative overflow-hidden
          ${isItemActive
            ? "bg-gray-300 text-blue-600 dark:text-gray-400 shadow-lg shadow-blue-500/10"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
          }
          transform ${isItemActive ? 'scale-[1.02]' : 'scale-100'}
        `}
      >


        {/* Main Content */}
        <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
          {/* Animated Icon */}
          <div className={`
            relative p-2 rounded-lg transition-all duration-300
            ${isItemActive
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-110"
              : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
            }
          `}>

            {/* Icon Pulse Effect */}
            {isItemActive && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 animate-ping opacity-20" />
            )}
          </div>

          {/* Label with Gradient Text */}
          <span className={`
            text-sm truncate font-medium bg-clip-text
            ${isItemActive
              ? "text-gray-700 fw-bold"
              : ""
            }
            transition-all duration-300
          `}>
            {item.label}
          </span>
        </div>

        {/* Right Indicators */}
        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
          {/* Badge */}
          {item.badge && (
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
              transition-all duration-300 transform
              ${isItemActive
                ? item.badge === 'AI'
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 shadow-sm scale-105'
                  : item.badge === 'Beta'
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 shadow-sm scale-105'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 shadow-sm scale-105'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 scale-100'
              }
            `}>
              {item.badge}
            </span>
          )}

          {/* Animated Chevron */}
          {hasChildren && (
            <ChevronDownIcon className={`
              w-4 h-4 transition-all duration-300 flex-shrink-0
              ${isCurrentlyExpanded
                ? "rotate-180 text-blue-500 scale-110"
                : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              }
            `} />
          )}
        </div>

        {/* Active Border Indicator */}
        {isItemActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full shadow-lg shadow-blue-500/30" />
        )}
      </Link>

      {/* Animated Dropdown Children */}
      {shouldRenderChildren && hasChildren && (
        <div className={`
          transform transition-all duration-300 ease-out overflow-hidden
          ${isExpanded
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
          }
        `}>
          <div className="pt-2">
            <SidebarDropdown item={item.children!} />
          </div>
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
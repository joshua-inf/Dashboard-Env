"use client";
import React from "react";
import Link from "next/link";
import SidebarItem from "../Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  ArrowTrendingUpIcon,
  Squares2X2Icon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  WalletIcon,
  ArchiveBoxIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { ShoppingBagIcon, UsersIcon } from "lucide-react";

// icons imports
import image5 from './icons/trybae.png'
import ClickOutside from "../ClickOutside";
import { SidebarProps } from "../types/types";
import LightDarkLogo from "@/components/Logo";
import { CreditCardIcon, DocumentTextIcon } from "@heroicons/react/20/solid";

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <Squares2X2Icon className="size-5" />,
        label: "Overview",
        route: "/overview",
        badge: "New"
      },
      {
        icon: <SparklesIcon className="size-5" />,
        label: "LennyAi",
        route: "/lennyAi",
        badge: "AI"
      },
      {
        icon: <ArrowTrendingUpIcon className="size-5" />,
        label: "Insights",
        route: "#",
        children: [
          { icon: <ArrowTrendingUpIcon className="size-5" />, label: "Sales Analytics", route: "/sales-analytics", badge: "Hot" },
          { icon: <ArrowTrendingUpIcon className="size-5" />, label: "Customer Analytics", route: "/customer-analytics" },
        ],
      },
      {
        icon: <ArchiveBoxIcon className="size-5" />,
        label: "Inventory",
        route: "/inventory",
      },
      {
        icon: <CreditCardIcon className="size-5" />,
        label: "POS",
        route: "/pos",
      },
      {
        icon: <UsersIcon className="size-5" />,
        label: "Teams",
        route: "/teams",
      },
      {
        icon: <ShoppingBagIcon className="size-5" />,
        label: "Products/Services",
        route: "/products_and_services",
      },
      {
        icon: <ClipboardDocumentIcon className="size-5" />,
        label: "Orders",
        route: "/orders",
        badge: "Updated"
      },
      {
        icon: <CpuChipIcon className="size-5" />,
        label: "AI Agents",
        route: "#",
        children: [
          { icon: <CpuChipIcon className="size-5" />, label: "WhatsApp Sales Agent", route: "/whatsAppSalesAgent", badge: "Beta" },
        ],
      },
      {
        icon: <WalletIcon className="size-5" />,
        label: "Wallet",
        route: "/wallet",
      },
      {
        icon: <DocumentTextIcon className="size-5" />,
        label: "Billing",
        route: "/Billing",
      },
      {
        icon: <Cog6ToothIcon className="size-5" />,
        label: "Settings",
        route: "/settings",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => sidebarOpen && setSidebarOpen(false)}>
      <aside
        className={`
          fixed left-0 top-0 z-[9999] flex h-screen w-72 flex-col
          bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-xl
          border-r border-gray-200/60 shadow-2xl transition-all duration-500 ease-in-out
          dark:from-gray-900/95 dark:to-gray-800/95 dark:border-gray-700/60 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <Link href="/" className="flex items-center gap-3 group">

            <div className="flex flex-col">
              <LightDarkLogo className="h-8" />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-[-2px]">
                Business Suite
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className="flex-1 overflow-y-auto px-3 pt-6 py-[100px]">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-8 last:mb-0">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3">
                  {group.name}
                </h3>

                <ul className="space-y-1">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 right-0 left-0 top-0 bottom-0 bg-black dark:bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </ClickOutside>
  );
};

export default Sidebar;
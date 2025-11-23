import { useState } from "react";
import Link from "next/link";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import ClickOutside from "../ClickOutside";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);


  const notifications = [
    {
      title: "Edit your information in a swipe",
      message: "Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
      date: "12 May, 2025",
    },
    {
      title: "It is a long established fact",
      message: "that a reader will be distracted by the readable.",
      date: "24 Feb, 2025",
    },
    {
      title: "There are many variations",
      message: "of passages of Lorem Ipsum available, but the majority have suffered",
      date: "04 Jan, 2025",
    },
    {
      title: "There are many variations",
      message: "of passages of Lorem Ipsum available, but the majority have suffered",
      date: "01 Dec, 2024",
    },
  ];

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          href="#"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-stroke bg-[#ededed] text-gray-800 hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span
            className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${notifying === false ? "hidden" : "inline"
              }`}
          >
            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

          <BellAlertIcon width={20} />
        </Link>

        {dropdownOpen && (
          <div
            className={`absolute -right-27 mt-2.5 flex h-90 w-75 p-3 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Notification
              </h5>
            </div>
            <ul className="flex flex-col h-auto overflow-y-auto p-3">
              {notifications.map((item, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark text-gray-800 dark:text-gray-300 dark:hover:bg-meta-4"
                  >
                    <p className="text-sm">
                      <span className="text-black dark:text-white">{item.title}</span>{" "}
                      {item.message}
                    </p>
                    <p className="text-xs">{item.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;

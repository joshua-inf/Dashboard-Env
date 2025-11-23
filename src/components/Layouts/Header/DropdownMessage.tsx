import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import ClickOutside from "../ClickOutside";

const DropdownMessage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          className="relative flex h-9 w-9 items-center justify-center rounded-full  hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:bg-transparent dark:text-white"
          href="#"
        >
          <Squares2X2Icon className="size-8.5 text-gray-700" />
        </Link>

        {/* <!-- Dropdown Start --> */}
        {dropdownOpen && (
          <div
            className={`absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">Messages</h5>
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              <li>
                <Link
                  className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  href="/messages"
                >
                  <div className="h-12.5 w-12.5 rounded-full">
                    <Image
                      width={112}
                      height={112}
                      src={"/images/user/user-02.png"}
                      alt="User"
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-black dark:text-white">
                      Mariya Desoja
                    </h6>
                    <p className="text-sm">I like your confidence 💪</p>
                    <p className="text-xs">2min ago</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  href="/messages"
                >
                  <div className="h-12.5 w-12.5 rounded-full">
                    <Image
                      width={112}
                      height={112}
                      src={"/images/user/user-01.png"}
                      alt="User"
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-black dark:text-white">
                      Robert Jhon
                    </h6>
                    <p className="text-sm">Can you share your offer?</p>
                    <p className="text-xs">10min ago</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  href="/messages"
                >
                  <div className="h-12.5 w-12.5 rounded-full">
                    <Image
                      width={112}
                      height={112}
                      src={"/images/user/user-03.png"}
                      alt="User"
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-black dark:text-white">
                      Henry Dholi
                    </h6>
                    <p className="text-sm">I cam across your profile and...</p>
                    <p className="text-xs">1day ago</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  href="/messages"
                >
                  <div className="h-12.5 w-12.5 rounded-full">
                    <Image
                      width={112}
                      height={112}
                      src={"/images/user/user-04.png"}
                      alt="User"
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-black dark:text-white">
                      Cody Fisher
                    </h6>
                    <p className="text-sm">I’m waiting for you response!</p>
                    <p className="text-xs">5days ago</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  href="/messages"
                >
                  <div className="h-12.5 w-12.5 rounded-full">
                    <Image
                      width={112}
                      height={112}
                      src={"/images/user/user-02.png"}
                      alt="User"
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-black dark:text-white">
                      Mariya Desoja
                    </h6>
                    <p className="text-sm">I like your confidence 💪</p>
                    <p className="text-xs">2min ago</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        )}
        {/* <!-- Dropdown End --> */}
      </li>
    </ClickOutside>
  );
};

export default DropdownMessage;

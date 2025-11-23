import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import ClickOutside from "../Layouts/ClickOutside";

const Search = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:text-primary dark:text-white"
        >
          <MagnifyingGlassIcon width={20} className=" font-bold text-gray-700 dark:text-white" />
        </button>

        {/* <!-- Dropdown Start --> */}
        {dropdownOpen && (
          <div className="fixed right-5 mt-2.5 w-75 rounded-md shadow-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark  w-80">
            <div className="p-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              />
            </div>
            
            {searchTerm && (
              <div className="border-t border-stroke px-4 py-2 dark:border-strokedark">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Search results will appear here...
                </p>
              </div>
            )}
          </div>
        )}
        {/* <!-- Dropdown End --> */}
      </li>
    </ClickOutside>
  );
};

export default Search;

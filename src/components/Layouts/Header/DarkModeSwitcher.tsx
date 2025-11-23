"use client";

import { useEffect } from 'react';
import { initializeTheme, toggleTheme } from '@/utils/theme';
import { MoonIcon, SunIcon } from 'lucide-react';

const DarkModeSwitcher = () => {
  useEffect(() => {
    // Initialize theme when component mounts
    initializeTheme();
  }, []);

  return (
    <li className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-boxdark transition-colors"
        aria-label="Toggle theme"
      >
        <SunIcon width={20} className=" text-gray-800 block dark:hidden" />
        <MoonIcon width={20} className=" hidden text-gray-200 dark:block" />
      </button>
    </li>
  );
};

export default DarkModeSwitcher;

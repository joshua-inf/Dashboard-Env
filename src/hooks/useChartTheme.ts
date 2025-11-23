"use client";

import { useEffect, useState } from 'react';
import { getChartTheme } from '@/utils/chartTheme';

export const useChartTheme = () => {
  const [theme, setTheme] = useState(getChartTheme(false));

  useEffect(() => {
    // Function to check dark mode
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(getChartTheme(isDark));
    };

    // Initial check
    checkDarkMode();

    // Create observer for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          checkDarkMode();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return theme;
}; 
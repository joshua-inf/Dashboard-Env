// Check if we're in the browser environment
const isClient = typeof window !== 'undefined';

// Get the initial theme from localStorage or system preference
export const getInitialTheme = (): boolean => {
  if (!isClient) return false;

  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem('darkMode');
  if (storedTheme !== null) {
    return storedTheme === 'true';
  }

  // If no stored preference, check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Initialize theme on page load
export const initializeTheme = () => {
  if (!isClient) return;

  const isDark = getInitialTheme();

  // Apply the theme
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Toggle theme and save to localStorage
export const toggleTheme = () => {
  if (!isClient) return;

  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark.toString());
  return isDark;
}; 
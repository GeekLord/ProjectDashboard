import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Home' },
  { to: '/dashboard/projects', label: 'Projects' },
  { to: '/dashboard/users', label: 'Users' },
  { to: '/dashboard/forms', label: 'Forms' },
  { to: '/dashboard/entries', label: 'Entries' },
];

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-400 via-purple-300 to-pink-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-gray-900/80 shadow-lg flex flex-col p-6 gap-4 min-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-pink-400 mb-6">Morsel Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-2 py-2 rounded font-medium transition-colors duration-200 ` +
                (isActive
                  ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow'
                  : 'text-blue-600 dark:text-pink-300 hover:underline hover:bg-blue-100 dark:hover:bg-gray-800')
              }
              end={item.to === '/dashboard'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="mt-auto py-2 px-4 rounded bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold shadow hover:from-pink-500 hover:to-blue-500 transition-colors"
          onClick={() => setDark(d => !d)}
          aria-label="Toggle dark mode"
        >
          {dark ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8 bg-white/70 dark:bg-gray-900/70 rounded-lg m-6 shadow-xl overflow-auto transition-colors duration-500">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-pink-300">Welcome to the Dashboard</h1>
          {/* Add user info, logout, etc. here */}
        </header>
        <div>{children}</div>
      </main>
    </div>
  );
};

export default DashboardShell; 
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex items-center justify-between">
      <div className="text-xl font-semibold text-gray-900 dark:text-white">
        Task Manager
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/tasks"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2"
        >
          Tasks
        </Link>
        <Link
          to="/profile"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2"
        >
          Profile
        </Link>
        <Link
          to="/auth"
          onClick={handleLogout}
          className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md px-3 py-2"
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Home, LogOut, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/new-appointment', label: 'Nueva Cita', icon: Calendar },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-dental-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-dental-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-dental-gray-800">
                DentalClinic
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(path)
                    ? 'text-dental-blue-600 bg-dental-blue-50'
                    : 'text-dental-gray-600 hover:text-dental-blue-600 hover:bg-dental-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User menu and logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-dental-gray-700">
              <User size={18} />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-dental-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dental-gray-600 hover:text-dental-blue-600 focus:outline-none focus:text-dental-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-dental-gray-200">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(path)
                      ? 'text-dental-blue-600 bg-dental-blue-50'
                      : 'text-dental-gray-600 hover:text-dental-blue-600 hover:bg-dental-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
              
              {/* Mobile user info and logout */}
              <div className="border-t border-dental-gray-200 pt-4 mt-4">
                <div className="flex items-center space-x-2 px-3 py-2 text-dental-gray-700">
                  <User size={18} />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-dental-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 w-full"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

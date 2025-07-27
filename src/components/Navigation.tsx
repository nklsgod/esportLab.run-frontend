import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-4">
              <img src={logo} alt="EsportLab" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-gray-900">EsportLab</h1>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/team"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/team')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Team {user?.hasTeam && user?.teamIds?.[0] && `(${user.teamIds.length})`}
              </Link>

              {user?.hasTeam && (
                <Link
                  to="/availability"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/availability')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Availability
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user?.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border-2 border-purple-200"
                />
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.hasTeam ? 'Team Member' : 'No Team'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-4 pb-2">
          <nav className="flex space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/team"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/team')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Team
            </Link>

            {user?.hasTeam && (
              <Link
                to="/availability"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/availability')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Availability
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, ClipboardCheck, Users, BarChart2, Settings } from 'lucide-react';
import Logo from '../Logo';
import { useAuth } from '../../contexts/AuthContext';

interface AdminSidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar = ({ open, toggleSidebar }: AdminSidebarProps) => {
  const { user, logout } = useAuth();

  const navLinks = [
    {
      to: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Overview',
    },
    {
      to: '/admin/dashboard/tender-requests',
      icon: <ClipboardCheck size={20} />,
      label: 'Tender Requests',
    },
    {
      to: '/admin/dashboard/users',
      icon: <Users size={20} />,
      label: 'User Management',
    },
    {
      to: '/admin/dashboard/analytics',
      icon: <BarChart2 size={20} />,
      label: 'Analytics',
    },
    {
      to: '/admin/dashboard/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
    },
  ];

  return (
    <aside 
      className={`bg-white shadow-lg z-20 fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out 
        ${open ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:w-64 flex-shrink-0`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Logo className="h-8" />
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {user && (
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
import { Menu, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="bg-white shadow-sm py-4 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
      </div>
      
      <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 flex-1 max-w-md mx-6">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none placeholder-gray-500 text-sm w-full"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              3
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
              <div className="p-3 border-b">
                <h3 className="text-sm font-semibold">Notifications</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <NotificationItem
                  type="tender"
                  title="New Tender Request"
                  description="TechSpace Developers submitted a new tender request"
                  time="10 minutes ago"
                />
                <NotificationItem
                  type="user"
                  title="New User Registration"
                  description="Raj Kumar registered a new account"
                  time="2 hours ago"
                />
                <NotificationItem
                  type="system"
                  title="System Update"
                  description="The website will undergo maintenance tonight"
                  time="1 day ago"
                />
              </div>
              <div className="p-2 border-t text-center">
                <Link
                  to="/admin/dashboard/notifications"
                  className="text-sm text-primary hover:underline block py-1"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <Link to="/" className="hidden md:block text-sm text-primary hover:underline">
          View Website
        </Link>
      </div>
    </header>
  );
};

interface NotificationItemProps {
  type: 'tender' | 'user' | 'system';
  title: string;
  description: string;
  time: string;
}

const NotificationItem = ({ type, title, description, time }: NotificationItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'tender':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            <ClipboardCheck size={20} />
          </div>
        );
      case 'user':
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
            <User size={20} />
          </div>
        );
      case 'system':
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
            <AlertTriangle size={20} />
          </div>
        );
    }
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer">
      <div className="flex items-start">
        {getIcon()}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
};

// Import icons used in the NotificationItem component
import { ClipboardCheck, User, AlertTriangle } from 'lucide-react';

export default AdminHeader;
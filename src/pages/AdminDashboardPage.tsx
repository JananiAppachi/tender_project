import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardHome from '../components/admin/DashboardHome';
import TenderRequests from '../components/admin/TenderRequests';
import UserManagement from '../components/admin/UserManagement';
import WebsiteAnalytics from '../components/admin/WebsiteAnalytics';
import AdminSettings from '../components/admin/AdminSettings';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { checkServerConnection, API_ENDPOINTS } from '../config/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

const AdminDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  useToast();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Close sidebar on mobile when route changes
    setSidebarOpen(false);
  }, [location.pathname]);

  const checkConnections = async () => {
    try {
      setIsLoading(true);
      setServerError(null);

      // Check API server connection
      const isServerConnected = await checkServerConnection();
      if (!isServerConnected) {
        setServerError('Cannot connect to the server. Please check if the server is running.');
        return;
      }

      setServerError(null);
    } catch (error) {
      console.error('Connection check error:', error);
      setServerError('Failed to establish connection with the server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      checkConnections();
    }
  }, [authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  if (serverError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
        <p className="text-gray-600 text-center mb-6 max-w-md">{serverError}</p>
        <button
          onClick={checkConnections}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Connection
        </button>
        <div className="mt-4 text-sm text-gray-500">
          Make sure the server is running and accessible at {API_ENDPOINTS.HEALTH}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="tender-requests/*" element={<TenderRequests />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<WebsiteAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
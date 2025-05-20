import { useState, useEffect, useCallback, useRef } from 'react';
import { ClipboardCheck, Calendar, Users, TrendingUp, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useToast } from '../../hooks/useToast';
import { API_ENDPOINTS } from '../../config/api';
import { ConnectionStatus } from '../ConnectionStatus';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

interface ProjectTypeData {
  name: string;
  value: number;
}

interface Activity {
  type: 'new_request' | 'status_update' | 'other';
  message: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface PerformanceMetric {
  name: string;
  value: number;
}

interface DashboardStats {
  totalRequests: number;
  newRequestsToday: number;
  totalUsers: number;
  activeUsers: number;
  requestsData: Array<{ month: string; count: number }>;
  projectTypesData: ProjectTypeData[];
  recentActivity: Activity[];
  performanceMetrics: PerformanceMetric[];
}

const StatCard = ({ title, value, icon, change, changeType }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
    </div>
    <div className="mt-4 flex items-center">
      {changeType === 'increase' ? (
        <ArrowUp size={16} className="text-green-500" />
      ) : changeType === 'decrease' ? (
        <ArrowDown size={16} className="text-red-500" />
      ) : null}
      <span className={`text-sm font-medium ${
        changeType === 'increase' ? 'text-green-500' : 
        changeType === 'decrease' ? 'text-red-500' : 
        'text-gray-500'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

const DashboardHome = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    newRequestsToday: 0,
    totalUsers: 0,
    activeUsers: 0,
    requestsData: [],
    projectTypesData: [],
    recentActivity: [],
    performanceMetrics: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleWebSocketMessage = useCallback((data: any) => {
    if (data.type === 'STATS_UPDATE') {
      setStats(prevStats => ({
        ...prevStats,
        ...data.stats
      }));
    }
  }, []);

  // WebSocket connection for real-time updates
  const { isConnected, error: wsError } = useWebSocket('DASHBOARD_STATS', {
    onMessage: handleWebSocketMessage,
    enabled: true
  });

  // Handle connection status changes with debounce
  useEffect(() => {
    if (!isConnected && wsError) {
      // Clear any existing timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      // Set a timeout to show the connection error
      connectionTimeoutRef.current = setTimeout(() => {
        setShowConnectionError(true);
        toast({
          title: 'Connection Lost',
          description: 'Real-time updates are temporarily disabled. Data will be refreshed periodically.',
          type: 'warning'
        });
      }, 5000); // Wait 5 seconds before showing connection error
    } else {
      // Clear the timeout and hide the error when connected
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      setShowConnectionError(false);
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [isConnected, wsError, toast]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setError(null);
      const { data } = await axios.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchDashboardStats, 300000);
    return () => clearInterval(interval);
  }, [fetchDashboardStats]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Dashboard</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <div className="space-y-6">
      {/* Connection Status - only show after timeout */}
      {showConnectionError && !isConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Connection to server lost. Some features may be delayed.
                <button
                  onClick={fetchDashboardStats}
                  className="ml-2 text-yellow-700 underline hover:text-yellow-600"
                >
                  Refresh data
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your infrastructure projects today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Tender Requests" 
          value={stats.totalRequests} 
          icon={<ClipboardCheck className="text-blue-600" size={24} />} 
          change={"+12.5%"} 
          changeType="increase"
        />
        <StatCard 
          title="New Requests Today" 
          value={stats.newRequestsToday} 
          icon={<Calendar className="text-green-600" size={24} />} 
          change={"+3"} 
          changeType="increase"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="text-purple-600" size={24} />} 
          change={"+5.2%"} 
          changeType="increase"
        />
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers} 
          icon={<TrendingUp className="text-orange-600" size={24} />} 
          change={"-2.1%"} 
          changeType="decrease"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Tender Requests (Last 12 Months)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.requestsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#1e40af" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Project Types Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.projectTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.projectTypesData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            {stats.projectTypesData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
                <span className="text-sm font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'new_request' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'status_update' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
            {(!stats.recentActivity || stats.recentActivity.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            {stats.performanceMetrics?.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                  <span className="text-sm font-medium text-gray-900">{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
            {(!stats.performanceMetrics || stats.performanceMetrics.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No performance metrics available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
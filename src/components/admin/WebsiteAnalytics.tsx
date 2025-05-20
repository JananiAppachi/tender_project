import { useState, useEffect, useRef } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axios from 'axios';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useToast } from '../../hooks/useToast';
import { Calendar, Users, MousePointer2, Clock } from 'lucide-react';
import { ConnectionStatus } from '../ConnectionStatus';
import { API_ENDPOINTS } from '../../config/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VisitorData {
  date: string;
  unique: number;
  pageViews: number;
}

interface SourceData {
  name: string;
  value: number;
}

interface PageViewData {
  page: string;
  views: number;
}

interface DeviceData {
  name: string;
  value: number;
}

interface AnalyticsData {
  visitors: VisitorData[];
  pageViews: PageViewData[];
  sources: SourceData[];
  devices: DeviceData[];
  engagementMetrics: {
    avgSessionDuration: string;
    bounceRate: string;
    pagesPerSession: number;
    activeUsers: number;
  };
}

interface WebSocketMessage {
  type: 'ANALYTICS_UPDATE';
  analytics: AnalyticsData;
}

const WebsiteAnalytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('7days');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const hasShownConnectedToast = useRef(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    visitors: [],
    pageViews: [],
    sources: [],
    devices: [],
    engagementMetrics: {
      avgSessionDuration: '0:00',
      bounceRate: '0%',
      pagesPerSession: 0,
      activeUsers: 0
    }
  });

  // WebSocket connection for real-time updates
  const { isConnected, error: wsError } = useWebSocket('WEBSITE_ANALYTICS', {
    onMessage: (data) => {
      if (data.type === 'ANALYTICS_UPDATE') {
        setAnalyticsData(prevData => ({
          ...prevData,
          ...data.analytics
        }));
      }
    },
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
        setShowConnectionStatus(true);
        toast({
          title: 'Connection Lost',
          description: 'Real-time updates are temporarily disabled. Data will be refreshed periodically.',
          type: 'warning'
        });
      }, 5000); // Wait 5 seconds before showing connection error
    } else if (isConnected) {
      // Clear the timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      setShowConnectionStatus(false);

      // Only show the connected toast once per session
      if (!hasShownConnectedToast.current) {
        toast({
          title: 'Connected',
          description: 'Real-time analytics updates are now active.',
          type: 'success'
        });
        hasShownConnectedToast.current = true;
      }
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [isConnected, wsError, toast]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_ENDPOINTS.ADMIN.ANALYTICS}?timeRange=${timeRange}`);
      
      if (response.status === 200 && response.data) {
        setAnalyticsData(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error fetching analytics data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load analytics data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (!isMounted) return;
      await fetchAnalyticsData();
    };

    loadData();

    // Refresh data every 5 minutes if the component is still mounted
    const interval = setInterval(() => {
      if (isMounted) {
        loadData();
      }
    }, 300000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [timeRange]);

  // Show loading state
  if (isLoading && !analyticsData.visitors.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error && !analyticsData.visitors.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={fetchAnalyticsData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const visitorChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        bodyFont: {
          size: 13
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  const sourceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="space-y-6">
      {/* Only show connection status after timeout and when disconnected */}
      {showConnectionStatus && !isConnected && <ConnectionStatus isConnected={isConnected} error={wsError} />}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Website Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold mt-1">
                {analyticsData.engagementMetrics.activeUsers}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            +12% from last week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Session Duration</p>
              <p className="text-2xl font-bold mt-1">
                {analyticsData.engagementMetrics.avgSessionDuration}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Clock className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            +5% from last week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bounce Rate</p>
              <p className="text-2xl font-bold mt-1">
                {analyticsData.engagementMetrics.bounceRate}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <MousePointer2 className="text-red-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-red-600">
            +2.3% from last week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pages / Session</p>
              <p className="text-2xl font-bold mt-1">
                {analyticsData.engagementMetrics.pagesPerSession}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Calendar className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            +8% from last week
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Visitor Trends</h2>
          <div className="h-80">
            <Line 
              data={{
                labels: analyticsData.visitors.map(v => v.date),
                datasets: [
                  {
                    label: 'Unique Visitors',
                    data: analyticsData.visitors.map(v => v.unique),
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    tension: 0.4,
                    fill: true
                  },
                  {
                    label: 'Page Views',
                    data: analyticsData.visitors.map(v => v.pageViews),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                  }
                ]
              }}
              options={visitorChartOptions}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
          <div className="h-80">
            <Doughnut
              data={{
                labels: analyticsData.sources.map(s => s.name),
                datasets: [{
                  data: analyticsData.sources.map(s => s.value),
                  backgroundColor: [
                    '#1e40af',
                    '#3b82f6',
                    '#60a5fa',
                    '#93c5fd',
                    '#bfdbfe'
                  ],
                  borderWidth: 0
                }]
              }}
              options={sourceChartOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Popular Pages</h2>
          <div className="h-80">
            <Bar
              data={{
                labels: analyticsData.pageViews.map(p => p.page),
                datasets: [{
                  label: 'Page Views',
                  data: analyticsData.pageViews.map(p => p.views),
                  backgroundColor: '#3b82f6',
                  borderRadius: 4
                }]
              }}
              options={{
                ...visitorChartOptions,
                indexAxis: 'y' as const,
                plugins: {
                  ...visitorChartOptions.plugins,
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Device Distribution</h2>
          <div className="h-80">
            <Doughnut
              data={{
                labels: analyticsData.devices.map(d => d.name),
                datasets: [{
                  data: analyticsData.devices.map(d => d.value),
                  backgroundColor: [
                    '#1e40af',
                    '#3b82f6',
                    '#60a5fa'
                  ],
                  borderWidth: 0
                }]
              }}
              options={sourceChartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteAnalytics;
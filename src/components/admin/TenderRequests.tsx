import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Download, Mail, Check, X, AlertCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import TenderRequestDetail from './TenderRequestDetail';
import { useToast } from '../../hooks/useToast';
import { useWebSocket } from '../../hooks/useWebSocket';
import { ConnectionStatus } from '../ConnectionStatus';
import { API_ENDPOINTS } from '../../config/api';

interface TenderRequest {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectType: string;
  projectLocation: string;
  estimatedBudget: string;
  preferredTimeline: string;
  projectDescription: string;
  status: 'new' | 'reviewed' | 'contacted' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

type WebSocketMessage = 
  | { type: 'NEW_REQUEST'; request: TenderRequest }
  | { type: 'UPDATE_REQUEST'; request: TenderRequest }
  | { type: 'DELETE_REQUEST'; requestId: string };

const TenderRequests = () => {
  return (
    <Routes>
      <Route index element={<TenderRequestsList />} />
      <Route path=":id" element={<TenderRequestDetail />} />
    </Routes>
  );
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const TenderRequestsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<TenderRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TenderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection for real-time updates
  const { isConnected, error: wsError } = useWebSocket<WebSocketMessage>('TENDER_REQUESTS', {
    onMessage: (data) => {
      switch (data.type) {
        case 'NEW_REQUEST':
          setRequests(prev => [data.request, ...prev]);
          break;
        case 'UPDATE_REQUEST':
          setRequests(prev => prev.map(req => 
            req._id === data.request._id ? data.request : req
          ));
          break;
        case 'DELETE_REQUEST':
          setRequests(prev => prev.filter(req => req._id !== data.requestId));
          break;
      }
    }
  });

  const fetchRequests = async (pageNum = 1, append = false) => {
    try {
      setIsLoadingMore(append);
      if (!append) {
        setIsLoading(true);
        setError(null);
      }

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        status: statusFilter !== 'all' ? statusFilter : '',
        projectType: projectTypeFilter !== 'all' ? projectTypeFilter : '',
        search: searchTerm
      });

      const { data } = await axios.get(`${API_ENDPOINTS.ADMIN.TENDER_REQUESTS}?${params}`);
      
      if (append) {
        setRequests(prev => [...prev, ...data.requests]);
        setFilteredRequests(prev => [...prev, ...data.requests]);
      } else {
        setRequests(data.requests);
        setFilteredRequests(data.requests);
      }
      
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching tender requests:', error);
      setError('Failed to load tender requests. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load tender requests. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, projectTypeFilter]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        fetchRequests();
      }
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm]);

  const handleLoadMore = () => {
    if (page < totalPages && !isLoadingMore) {
      setPage(prev => prev + 1);
      fetchRequests(page + 1, true);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: TenderRequest['status']) => {
    try {
      await axios.patch(`${API_ENDPOINTS.ADMIN.TENDER_REQUESTS}/${requestId}/status`, {
        status: newStatus
      });
      
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: newStatus } : req
      ));
      
      toast({
        title: 'Success',
        description: 'Request status updated successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request status',
        type: 'error'
      });
    }
  };

  const getUniqueProjectTypes = () => {
    const types = requests.map(request => request.projectType);
    return ['all', ...new Set(types)];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>;
      case 'reviewed':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Reviewed</span>;
      case 'contacted':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Contacted</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Completed</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Rejected</span>;
      default:
        return null;
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    
    try {
      // In a real app, we would call an API endpoint to generate and download the CSV
      // For demo purposes, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Export feature would download a CSV file with the filtered tender requests.');
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Requests</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => fetchRequests()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <ConnectionStatus isConnected={isConnected} error={wsError} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tender Requests</h1>
          <p className="text-gray-600">Manage and track all tender requests from clients</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={toggleFilters}
            className="btn-secondary flex items-center"
          >
            <Filter size={16} className="mr-1" />
            Filters
          </button>
          <button 
            onClick={handleExportCSV}
            className="btn-secondary flex items-center"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} className="mr-1" />
                Export
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by company, contact person, or location..."
              className="bg-transparent border-none outline-none placeholder-gray-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showFilters && (
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="input-field"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  className="input-field"
                  value={projectTypeFilter}
                  onChange={(e) => setProjectTypeFilter(e.target.value)}
                >
                  {getUniqueProjectTypes().map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Project Types' : type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setProjectTypeFilter('all');
                    setSearchTerm('');
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.companyName}</div>
                      <div className="text-sm text-gray-500">{request.contactPerson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.projectType}</div>
                      <div className="text-sm text-gray-500">{request.projectLocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/dashboard/tender-requests/${request._id}`)}
                          className="text-primary hover:text-primary-dark transition-colors"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => window.location.href = `mailto:${request.email}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Send email"
                        >
                          <Mail size={18} />
                        </button>
                        {request.status === 'new' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(request._id, 'reviewed')}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="Mark as reviewed"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(request._id, 'rejected')}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center py-6">
                      <AlertCircle size={24} className="text-gray-400 mb-2" />
                      <p className="text-gray-500 text-lg">No tender requests found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {page < totalPages && (
          <div className="px-6 py-4 border-t">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full btn-secondary flex items-center justify-center"
            >
              {isLoadingMore ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderRequests;
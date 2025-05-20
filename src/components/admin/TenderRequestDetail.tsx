import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, Mail, Check, X, Edit, Printer, Download, User, Phone, MapPin, Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

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
  notes?: string[];
}

const TenderRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<TenderRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        if (!id) return;
        
        // In a real app, we would fetch from the actual API
        // const { data } = await axios.get(`/api/admin/tender-requests/${id}`);
        
        // For demo purposes, use mock data
        const mockRequest: TenderRequest = {
          _id: id,
          companyName: 'TechSpace Developers',
          contactPerson: 'Rajesh Kumar',
          email: 'rajesh@techspace.com',
          phone: '+91 98765 43210',
          projectType: 'Commercial Construction',
          projectLocation: 'Bangalore, Karnataka',
          estimatedBudget: '₹1 Crore - ₹5 Crores',
          preferredTimeline: '6-12 months',
          projectDescription: 'We are looking to build a new office complex with modern amenities and eco-friendly design. The project will include:\n\n- Three towers with a total of 150,000 square feet of office space\n- Smart building technology integration for enhanced security and energy efficiency\n- Green roof terraces and sustainable water management systems\n- Underground parking for 200 vehicles\n- Common areas including cafeteria, gym, and conference facilities\n\nOur goal is to create an iconic, environmentally conscious workspace that will serve as our company headquarters for the next decade.',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: [
            'Initial review completed. Project looks promising and aligns with our portfolio. - Admin (Aug 23, 2023)',
            'Scheduled initial call with Rajesh to discuss project scope in more detail. - Admin (Aug 24, 2023)'
          ]
        };
        
        setRequest(mockRequest);
      } catch (error) {
        console.error('Error fetching tender request details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tender request details',
          variant: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, toast]);

  const handleStatusChange = async (newStatus: TenderRequest['status']) => {
    if (!request) return;
    
    setIsChangingStatus(true);
    
    try {
      // In a real app, we would call the API to update the status
      // await axios.patch(`/api/admin/tender-requests/${id}/status`, { status: newStatus });
      
      // For demo purposes, just update the local state
      setRequest({
        ...request,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: 'Status Updated',
        description: `Request status changed to ${newStatus}`,
        variant: 'success'
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update request status',
        variant: 'error'
      });
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!request || !newNote.trim()) return;
    
    setIsSubmittingNote(true);
    
    try {
      // In a real app, we would call the API to add a note
      // await axios.post(`/api/admin/tender-requests/${id}/notes`, { content: newNote });
      
      // For demo purposes, just update the local state
      const updatedNotes = [...(request.notes || []), `${newNote} - Admin (${format(new Date(), 'MMM d, yyyy')})`];
      
      setRequest({
        ...request,
        notes: updatedNotes,
        updatedAt: new Date().toISOString()
      });
      
      setNewNote('');
      
      toast({
        title: 'Note Added',
        description: 'Your note has been added to the request',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Failed to Add Note',
        description: 'There was an error adding your note',
        variant: 'error'
      });
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleSendEmail = async () => {
    if (!request) return;
    
    setIsSendingEmail(true);
    
    try {
      // In a real app, we would call the API to send an email
      // await axios.post(`/api/admin/tender-requests/${id}/send-email`);
      
      // For demo purposes, just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Email Sent',
        description: `Email has been sent to ${request.contactPerson}`,
        variant: 'success'
      });
      
      // Also add a note about the email
      const updatedNotes = [...(request.notes || []), `Email sent to ${request.contactPerson} regarding the tender request. - Admin (${format(new Date(), 'MMM d, yyyy')})`];
      
      setRequest({
        ...request,
        notes: updatedNotes,
        status: 'contacted',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Email Failed',
        description: 'Failed to send email to the client',
        variant: 'error'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">New</span>;
      case 'reviewed':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Reviewed</span>;
      case 'contacted':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Contacted</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Completed</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Rejected</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center py-8">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tender Request Not Found</h2>
          <p className="text-gray-600 mb-6">The tender request you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/admin/dashboard/tender-requests')}
            className="btn-primary"
          >
            Back to Tender Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/dashboard/tender-requests')}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Tender Requests
        </button>
        
        <div className="flex space-x-2">
          <button className="btn-secondary flex items-center">
            <Printer size={16} className="mr-1" />
            Print
          </button>
          <button className="btn-secondary flex items-center">
            <Download size={16} className="mr-1" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{request.companyName}</h1>
              <p className="text-gray-600">Tender Request ID: {request._id}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              {getStatusBadge(request.status)}
              <span className="ml-4 text-gray-500 text-sm">
                Submitted on {format(new Date(request.createdAt), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{request.contactPerson}</p>
                      <p className="text-sm text-gray-500">Contact Person</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{request.email}</p>
                      <p className="text-sm text-gray-500">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{request.phone}</p>
                      <p className="text-sm text-gray-500">Phone Number</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Project Details</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FileText size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{request.projectType}</p>
                      <p className="text-sm text-gray-500">Project Type</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{request.projectLocation}</p>
                      <p className="text-sm text-gray-500">Location</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{request.estimatedBudget}</p>
                      <p className="text-sm text-gray-500">Estimated Budget</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{request.preferredTimeline}</p>
                      <p className="text-sm text-gray-500">Preferred Timeline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Project Description</h2>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="whitespace-pre-line text-gray-700">{request.projectDescription}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSendEmail}
                className="btn-primary flex items-center"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={16} className="mr-2" />
                    Send Email
                  </>
                )}
              </button>
              
              {request.status === 'new' && (
                <button
                  onClick={() => handleStatusChange('reviewed')}
                  className="btn-secondary flex items-center bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border-yellow-300"
                  disabled={isChangingStatus}
                >
                  {isChangingStatus ? 'Updating...' : (
                    <>
                      <Check size={16} className="mr-2" />
                      Mark as Reviewed
                    </>
                  )}
                </button>
              )}
              
              {request.status === 'reviewed' && (
                <button
                  onClick={() => handleStatusChange('contacted')}
                  className="btn-secondary flex items-center bg-green-50 hover:bg-green-100 text-green-800 border-green-300"
                  disabled={isChangingStatus}
                >
                  {isChangingStatus ? 'Updating...' : (
                    <>
                      <Check size={16} className="mr-2" />
                      Mark as Contacted
                    </>
                  )}
                </button>
              )}
              
              {(request.status === 'contacted') && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="btn-secondary flex items-center bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300"
                  disabled={isChangingStatus}
                >
                  {isChangingStatus ? 'Updating...' : (
                    <>
                      <Check size={16} className="mr-2" />
                      Mark as Completed
                    </>
                  )}
                </button>
              )}
              
              {request.status !== 'rejected' && request.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="btn-secondary flex items-center bg-red-50 hover:bg-red-100 text-red-800 border-red-300"
                  disabled={isChangingStatus}
                >
                  {isChangingStatus ? 'Updating...' : (
                    <>
                      <X size={16} className="mr-2" />
                      Reject Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notes & Activity</h2>
          
          <div className="mb-6">
            <div className="flex">
              <textarea
                className="input-field flex-grow"
                rows={3}
                placeholder="Add a note about this tender request..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddNote}
                className="btn-primary"
                disabled={isSubmittingNote || !newNote.trim()}
              >
                {isSubmittingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {request.notes && request.notes.length > 0 ? (
              request.notes.map((note, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-gray-700">{note}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="mx-auto h-8 w-8 mb-2" />
                <p>No notes or activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderRequestDetail;
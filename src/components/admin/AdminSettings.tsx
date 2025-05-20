import { useState } from 'react';
import { Save, Mail, Bell, Lock, Globe, User } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [emailSettings, setEmailSettings] = useState({
    emailHost: 'smtp.example.com',
    emailPort: '587',
    emailUser: 'notifications@dhiyainfra.com',
    emailFrom: 'Dhiya Infrastructure <notifications@dhiyainfra.com>',
    sendWelcomeEmails: true,
    sendStatusUpdateEmails: true
  });
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Dhiya Infrastructure',
    siteTagline: 'Building the future with innovative infrastructure solutions',
    contactEmail: 'info@dhiyainfra.com',
    contactPhone: '+91 8148170052',
    contactAddress: 'NO.9, Devanayaki Nagar 4th Street, Sanganoor Road, Coimbatore, Tamil Nadu, India - 641006'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    newTenderRequest: true,
    newUserRegistration: true,
    tenderStatusChange: true,
    emailNotifications: true,
    dashboardNotifications: true
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: 'Password Error',
        description: 'New passwords do not match',
        variant: 'error'
      });
      return;
    }
    
    // In a real app, we would call an API to update the profile
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully',
      variant: 'success'
    });
  };

  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would call an API to update email settings
    toast({
      title: 'Email Settings Updated',
      description: 'Email configuration has been updated successfully',
      variant: 'success'
    });
  };

  const handleGeneralSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would call an API to update general settings
    toast({
      title: 'General Settings Updated',
      description: 'Website settings have been updated successfully',
      variant: 'success'
    });
  };

  const handleNotificationSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would call an API to update notification settings
    toast({
      title: 'Notification Settings Updated',
      description: 'Your notification preferences have been saved',
      variant: 'success'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full md:w-1/4 pr-0 md:pr-6 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <nav className="p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-4 py-3 rounded-md text-left mb-2 ${
                  activeTab === 'profile' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <User size={20} className="mr-3" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('email')}
                className={`flex items-center w-full px-4 py-3 rounded-md text-left mb-2 ${
                  activeTab === 'email' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Mail size={20} className="mr-3" />
                <span>Email Settings</span>
              </button>
              
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center w-full px-4 py-3 rounded-md text-left mb-2 ${
                  activeTab === 'general' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Globe size={20} className="mr-3" />
                <span>General Settings</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center w-full px-4 py-3 rounded-md text-left mb-2 ${
                  activeTab === 'notifications' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Bell size={20} className="mr-3" />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full px-4 py-3 rounded-md text-left mb-2 ${
                  activeTab === 'security' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Lock size={20} className="mr-3" />
                <span>Security</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{profileData.username}</h3>
                        <p className="text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium mb-3">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleProfileChange}
                        className="input-field"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={profileData.newPassword}
                          onChange={handleProfileChange}
                          className="input-field"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profileData.confirmPassword}
                          onChange={handleProfileChange}
                          className="input-field"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      className="btn-primary flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Email Settings Tab */}
            {activeTab === 'email' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Email Configuration</h2>
                <form onSubmit={handleEmailSettingsSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        name="emailHost"
                        value={emailSettings.emailHost}
                        onChange={handleEmailSettingsChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        name="emailPort"
                        value={emailSettings.emailPort}
                        onChange={handleEmailSettingsChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        name="emailUser"
                        value={emailSettings.emailUser}
                        onChange={handleEmailSettingsChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        name="emailPassword"
                        placeholder="••••••••"
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        "From" Email Address
                      </label>
                      <input
                        type="text"
                        name="emailFrom"
                        value={emailSettings.emailFrom}
                        onChange={handleEmailSettingsChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium mb-3">Email Notifications</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sendWelcomeEmails"
                        name="sendWelcomeEmails"
                        checked={emailSettings.sendWelcomeEmails}
                        onChange={handleEmailSettingsChange}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="sendWelcomeEmails" className="ml-2 block text-sm text-gray-700">
                        Send welcome emails to new users
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sendStatusUpdateEmails"
                        name="sendStatusUpdateEmails"
                        checked={emailSettings.sendStatusUpdateEmails}
                        onChange={handleEmailSettingsChange}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="sendStatusUpdateEmails" className="ml-2 block text-sm text-gray-700">
                        Send status update emails for tender requests
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Email settings affect how the system communicates with clients and team members. Make sure your SMTP settings are correct before saving.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      className="btn-primary flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save Email Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">General Settings</h2>
                <form onSubmit={handleGeneralSettingsSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        name="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralSettingsChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Tagline
                      </label>
                      <input
                        type="text"
                        name="siteTagline"
                        value={generalSettings.siteTagline}
                        onChange={handleGeneralSettingsChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={generalSettings.contactEmail}
                        onChange={handleGeneralSettingsChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        name="contactPhone"
                        value={generalSettings.contactPhone}
                        onChange={handleGeneralSettingsChange}
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Office Address
                      </label>
                      <textarea
                        name="contactAddress"
                        value={generalSettings.contactAddress}
                        onChange={handleGeneralSettingsChange}
                        className="input-field"
                        rows={2}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      className="btn-primary flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save General Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                <form onSubmit={handleNotificationSettingsSubmit}>
                  <h3 className="text-md font-medium mb-3">Notification Events</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newTenderRequest"
                        name="newTenderRequest"
                        checked={notificationSettings.newTenderRequest}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="newTenderRequest" className="ml-2 block text-sm text-gray-700">
                        New tender requests
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newUserRegistration"
                        name="newUserRegistration"
                        checked={notificationSettings.newUserRegistration}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="newUserRegistration" className="ml-2 block text-sm text-gray-700">
                        New user registrations
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="tenderStatusChange"
                        name="tenderStatusChange"
                        checked={notificationSettings.tenderStatusChange}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="tenderStatusChange" className="ml-2 block text-sm text-gray-700">
                        Tender request status changes
                      </label>
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium mb-3">Notification Methods</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                        Email notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dashboardNotifications"
                        name="dashboardNotifications"
                        checked={notificationSettings.dashboardNotifications}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="dashboardNotifications" className="ml-2 block text-sm text-gray-700">
                        Dashboard notifications
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      className="btn-primary flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      Save Notification Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mb-4">
                    Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
                  </p>
                  
                  <button className="btn-primary">
                    Enable Two-Factor Authentication
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Session Management</h3>
                  <p className="text-gray-600 mb-4">
                    Review and manage your active sessions. You can log out from all devices if you suspect unauthorized access.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg border p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                        <p className="text-xs text-gray-500">Active now</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg border p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-sm text-gray-500">Mobile • IP: 192.168.1.2</p>
                        <p className="text-xs text-gray-500">Last active: 2 days ago</p>
                      </div>
                      <button className="text-red-600 text-sm hover:underline">
                        Revoke
                      </button>
                    </div>
                  </div>
                  
                  <button className="text-red-600 font-medium hover:underline">
                    Log out from all devices
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Login History</h3>
                  <p className="text-gray-600 mb-4">
                    Review recent login activity for your account. If you see any suspicious activity, change your password immediately.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="mr-3 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Successful login from Chrome on Windows</p>
                        <p className="text-xs text-gray-500">IP: 192.168.1.1 • Today, 10:24 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Successful login from Safari on iPhone</p>
                        <p className="text-xs text-gray-500">IP: 192.168.1.2 • Yesterday, 4:12 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Failed login attempt from unknown device</p>
                        <p className="text-xs text-gray-500">IP: 203.0.113.42 • 3 days ago, 11:55 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
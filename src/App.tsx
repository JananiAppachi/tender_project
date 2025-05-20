import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TenderRequestPage from './pages/TenderRequestPage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TendersPage from './pages/TendersPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserLoginPage from './pages/UserLoginPage';
import UserRegistrationPage from './pages/UserRegistrationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TenderComparisonPage from './pages/TenderComparisonPage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import { useEffect } from 'react';
import { checkServerConnection } from './config/api';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  useEffect(() => {
    // Check server connection on app start
    const checkConnection = async () => {
      const isConnected = await checkServerConnection();
      console.log('Server connection status:', isConnected);
    };
    checkConnection();
  }, []);

  console.log('App component rendering');

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="request-tender" element={<TenderRequestPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="tenders" element={<TendersPage />} />
        <Route path="tender-comparison" element={<TenderComparisonPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="user/login" element={<UserLoginPage />} />
        <Route path="user/register" element={<UserRegistrationPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route 
        path="/admin/dashboard/*" 
        element={
          <PrivateRoute>
            <AdminDashboardPage />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;
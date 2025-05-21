import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AlertCircle, Loader } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface ResetPasswordInputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<ResetPasswordInputs>();

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'Password Error',
        description: 'Passwords do not match',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = searchParams.get('token');
      if (!token) {
        throw new Error('Reset token is missing');
      }

      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword: data.newPassword
      });
      
      toast({
        title: 'Password Reset Successful',
        description: 'You can now login with your new password',
        type: 'success'
      });
      
      navigate('/user/login');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Reset Failed',
        description: error.response?.data?.message || 'Failed to reset password. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
              <p className="text-gray-600 mt-2">Enter your new password below</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className={`input-field ${errors.newPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your new password',
                    validate: value => value === watch('newPassword') || 'Passwords do not match'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 
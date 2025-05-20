import { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ClipboardCheck, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../hooks/useToast';
import { API_ENDPOINTS } from '../config/api';

interface TenderFormInputs {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectType: string;
  projectLocation: string;
  estimatedBudget: string;
  preferredTimeline: string;
  projectDescription: string;
}

const TenderRequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const hasSubmittedRef = useRef(false);
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<TenderFormInputs>();

  const projectTypes = [
    "Commercial Construction",
    "Infrastructure Development",
    "Residential Project",
    "Industrial Construction",
    "Renovation & Restoration",
    "Other"
  ];

  const budgetRanges = [
    "Below ₹50 Lakhs",
    "₹50 Lakhs - ₹1 Crore",
    "₹1 Crore - ₹5 Crores",
    "₹5 Crores - ₹20 Crores",
    "Above ₹20 Crores"
  ];

  const timelines = [
    "Within 6 months",
    "6-12 months",
    "1-2 years",
    "More than 2 years",
    "Flexible"
  ];

  const onSubmit: SubmitHandler<TenderFormInputs> = async (data) => {
    // Prevent multiple submissions
    if (isSubmitting || hasSubmittedRef.current) {
      return;
    }

    setIsSubmitting(true);
    hasSubmittedRef.current = true;
    
    try {
      // Use the API_ENDPOINTS constant for the URL
      await axios.post(API_ENDPOINTS.ADMIN.TENDER_REQUESTS, {
        ...data,
        status: 'new' // Set initial status
      });
      
      // Clear any existing timeout
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }

      // Show success message only once
      toast({
        title: "Success!",
        description: "Your tender request has been submitted successfully. Our team will contact you soon.",
        type: "success"
      });
      
      reset();

      // Reset submission state after 5 seconds
      submitTimeoutRef.current = setTimeout(() => {
        hasSubmittedRef.current = false;
      }, 5000);
    } catch (error) {
      console.error("Error submitting tender request:", error);
      
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again later.",
        type: "error"
      });

      // Reset submission state immediately on error
      hasSubmittedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">Request a Tender</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interested in working with Dhiya Infrastructure? Fill out the form below to submit 
            your tender request. Our team will review your requirements and get back to you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Tender Request Form</h2>
            <p className="text-gray-500 mb-6">Provide details about your infrastructure project needs for a prompt response from our team.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
                    placeholder="Your company name"
                    {...register('companyName', { required: 'Company name is required' })}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    className={`input-field ${errors.projectType ? 'border-red-500' : ''}`}
                    {...register('projectType', { required: 'Project type is required' })}
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    id="contactPerson"
                    type="text"
                    className={`input-field ${errors.contactPerson ? 'border-red-500' : ''}`}
                    placeholder="Full name"
                    {...register('contactPerson', { required: 'Contact person is required' })}
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.contactPerson.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="projectLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Location
                  </label>
                  <input
                    id="projectLocation"
                    type="text"
                    className={`input-field ${errors.projectLocation ? 'border-red-500' : ''}`}
                    placeholder="City, State"
                    {...register('projectLocation', { required: 'Project location is required' })}
                  />
                  {errors.projectLocation && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.projectLocation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="your.email@company.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Budget
                  </label>
                  <select
                    id="estimatedBudget"
                    className={`input-field ${errors.estimatedBudget ? 'border-red-500' : ''}`}
                    {...register('estimatedBudget', { required: 'Estimated budget is required' })}
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {errors.estimatedBudget && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.estimatedBudget.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">This helps us understand the scope of your project</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+91 XXXXX XXXXX"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                        message: 'Invalid phone number',
                      }
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="preferredTimeline" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Timeline
                  </label>
                  <select
                    id="preferredTimeline"
                    className={`input-field ${errors.preferredTimeline ? 'border-red-500' : ''}`}
                    {...register('preferredTimeline', { required: 'Preferred timeline is required' })}
                  >
                    <option value="">Select timeline</option>
                    {timelines.map((timeline) => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                  {errors.preferredTimeline && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.preferredTimeline.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  rows={5}
                  className={`input-field ${errors.projectDescription ? 'border-red-500' : ''}`}
                  placeholder="Please provide details about your project, including specific requirements, challenges, or goals..."
                  {...register('projectDescription', { 
                    required: 'Project description is required',
                    minLength: {
                      value: 50,
                      message: 'Description should be at least 50 characters'
                    }
                  })}
                ></textarea>
                {errors.projectDescription && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.projectDescription.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">The more details you provide, the better we can assess your project</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary py-3 px-6 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="mr-2" size={18} />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">What Happens Next?</h2>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                  1
                </div>
                <h3 className="font-medium text-lg mb-2">Review</h3>
                <p className="text-gray-600">
                  Our team will review your project requirements within 2 business days.
                </p>
              </div>
              
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                  2
                </div>
                <h3 className="font-medium text-lg mb-2">Consultation</h3>
                <p className="text-gray-600">
                  We'll schedule a consultation to discuss your project in detail.
                </p>
              </div>
              
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                  3
                </div>
                <h3 className="font-medium text-lg mb-2">Proposal</h3>
                <p className="text-gray-600">
                  You'll receive a detailed proposal with timeline and cost estimates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderRequestPage;
import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, AlertCircle, Eye, EyeOff, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [isNavigating, setIsNavigating] = useState(false);

  // Use ref to track if request is in progress - this persists across re-renders
  const isRequestInProgress = useRef(false);

  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
  const validateField = (name: string, value: string) => {
    let errorMessage = '';
    
    if (name === 'username') {
      if (!value.trim()) {
        errorMessage = 'Email is required';
      } else if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
      }
    } else if (name === 'password') {
      if (!value) {
        errorMessage = 'Password is required';
      } else if (value.length < 6) {
        errorMessage = 'Password must be at least 6 characters';
      }
    }
    
    return errorMessage;
  };

  // Check if form is valid
  useEffect(() => {
    const isValid = 
      formData.username.trim() !== '' &&
      formData.password !== '' &&
      !validationErrors.username &&
      !validationErrors.password &&
      emailRegex.test(formData.username);
    
    setIsFormValid(isValid);
  }, [formData, validationErrors]);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      show: true,
      message,
      type
    });
    
    // Auto hide after 2 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2000);
  };

  // Hide toast
  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field and update validation errors
    const errorMessage = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    // Clear general error when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    // ENHANCED: Block multiple requests using both ref and state
    if (isRequestInProgress.current || isLoading || !isFormValid) {
      console.log('Request blocked - already in progress or form invalid');
      return;
    }

    // Immediately set both flags to block any subsequent calls
    isRequestInProgress.current = true;
    setIsLoading(true);
    setError('');

    console.log('Login request started...');

    try {
      // Simulate API call - replace with actual axios call
      const response = await fetch('http://localhost:3000/api/v1/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signin failed');
      }

      // Store token in localStorage
      console.log('Login successful! Token:', data.token);
      localStorage.setItem('token', data.token);
      
      // Show success toast
      showToast('Login successful! Redirecting to dashboard...', 'success');
      
      // Set navigating state to keep button disabled
      setIsNavigating(true);
      
      // Navigate after 2 seconds
      setTimeout(() => {
      navigate('/dashboard');
        console.log('Navigating to dashboard...');
        // Reset navigating state after navigation
        setIsNavigating(false);
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'Signin failed. Please try again.');
      showToast(error.message || 'Signin failed. Please try again.', 'error');
    } finally {
      // Only reset loading state, keep request flag if navigating
      setIsLoading(false);
      if (!isNavigating) {
        isRequestInProgress.current = false;
      }
      console.log('Login request completed/failed - ready for new requests');
    }
  };

  const handleForgotPassword = () => {
    showToast('Redirecting to forgot password page...', 'success');
    
    // Navigate after 2 seconds
    setTimeout(() => {
      // navigate('/forgot-password');
      console.log('Navigating to forgot password page...');
    }, 2000);
  };

  const handleSignUp = () => {
    showToast('Redirecting to sign up page...', 'success');
    
    // Navigate after 2 seconds
    setTimeout(() => {
      navigate('/signup');
      console.log('Navigating to sign up page...');
    }, 2000);
  };

  // Calculate if button should be disabled
  const isButtonDisabled = isLoading || !isFormValid || isRequestInProgress.current || isNavigating;

  return (
    <div className="min-h-screen bg-[#110E23] flex flex-row relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border max-w-sm ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={hideToast}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {/* Left Pane */}
      <div className="w-1/2 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16 text-center lg:text-left">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to
          </h1>
          <h1 className="text-5xl font-bold text-white mb-4">
            Tu Bhar
          </h1>
          <p className="text-lg text-slate-300 font-light">
            A single resolve for all your payments
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  TU BHAR
                </h2>
                <p className="text-slate-600 text-base">
                  Login to your account
                </p>
          </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

              <div className="space-y-6">
                {/* Email Field */}
            <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="username">
                    Email Address
              </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
              <input
                      id="username"
                type="email"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`block w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        validationErrors.username 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                required
                      disabled={isLoading}
                    />
                  </div>
                  {validationErrors.username && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.username}</span>
                    </p>
                  )}
            </div>

                {/* Password Field */}
            <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
              <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`block w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        validationErrors.password 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-slate-100 rounded-r-lg transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{validationErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-cyan-500 hover:text-cyan-600 hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
            </div>

                {/* Login Button - ENHANCED */}
            <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isButtonDisabled}
                  className={`w-full font-semibold py-3 px-4 rounded-lg text-base transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    isButtonDisabled
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                      : 'bg-cyan-500 hover:bg-cyan-600 hover:-translate-y-0.5 hover:shadow-lg text-white'
                  }`}
                  style={{
                    pointerEvents: isButtonDisabled ? 'none' : 'auto'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : isNavigating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Redirecting...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
            </button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <span className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={handleSignUp}
                      className="text-cyan-500 hover:text-cyan-600 hover:underline transition-colors duration-200 font-medium bg-transparent border-none cursor-pointer p-0"
                      disabled={isLoading}
                    >
                      Sign up
                    </button>
                  </span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
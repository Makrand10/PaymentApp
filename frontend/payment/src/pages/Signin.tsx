import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // To do: Implement login logic
    console.log('Login attempted with:', formData);
  };

  return (
    <div className="min-h-screen bg-[#110E23] flex flex-row">
      {/* Left Pane */}
      <div className="w-1/2 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16 text-center lg:text-left">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Welcome to MakPay
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
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                MakPay
              </h2>
              <p className="text-slate-600 text-base">
                Login to your account
              </p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    required
                  />
                </div>
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
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-cyan-500 hover:text-cyan-600 hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg text-base transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Login
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <span className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-cyan-500 hover:text-cyan-600 hover:underline transition-colors duration-200 font-medium bg-transparent border-none cursor-pointer p-0"
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
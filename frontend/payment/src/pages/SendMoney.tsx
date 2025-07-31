import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Wallet } from 'lucide-react';
import axios from 'axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface LocationState {
  recipient?: User;
  balance?: number;
}

export function SendMoney() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userBalance, setUserBalance] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get recipient data from navigation state
  const state = location.state as LocationState;
  const recipient = state?.recipient;
  const passedBalance = state?.balance;

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Set auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Use passed balance or fetch current balance
    if (passedBalance !== undefined) {
      setUserBalance(passedBalance);
    } else {
      fetchBalance();
    }
  }, [navigate, passedBalance]);

  const fetchBalance = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/account/balance');
      setUserBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(balance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient) {
      setError('No recipient selected');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (transferAmount > userBalance) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/v1/account/transfer', {
        amount: transferAmount,
        to: recipient.id
      });

      setSuccess(`₹${transferAmount} sent successfully to ${recipient.firstName} ${recipient.lastName}`);
      setAmount('');
      
      // Update balance
      setUserBalance(prev => prev - transferAmount);
      
      // Navigate back to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  // If no recipient is selected, show user selection prompt
  if (!recipient) {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-xl font-semibold text-slate-800">Send Money</h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-md mx-auto py-12 px-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">No Recipient Selected</h2>
            <p className="text-slate-600 mb-6">Please go back to the dashboard and select a user to send money to.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-xl font-semibold text-slate-800">Send Money</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Wallet className="w-4 h-4" />
              <span>Balance: {formatBalance(userBalance)}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-12 px-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-6 text-center border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Money</h2>
          </div>

          {/* Recipient Info */}
          <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                {getInitials(recipient.firstName, recipient.lastName)}
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-800">
                  {recipient.firstName} {recipient.lastName}
                </div>
                <div className="text-slate-500 text-sm">
                  @{recipient.username}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  ID: {recipient.id}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount (in Rs)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={userBalance}
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-lg"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                />
                <div className="mt-2 text-xs text-slate-500">
                  Available balance: {formatBalance(userBalance)}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !amount}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {loading ? 'Processing...' : 'Initiate Transfer'}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mt-6">
          <div className="text-sm text-slate-600 mb-3">Quick amounts:</div>
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 2000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                disabled={loading || quickAmount > userBalance}
                className="py-2 px-3 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
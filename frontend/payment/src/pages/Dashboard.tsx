import React, { useState, useEffect } from 'react';
import { Search, ArrowRightLeft, LogOut, User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface Account {
  balance: number;
}

// Send Money Button Component
const SendMoneyButton = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
    >
      Send Money
    </button>
  );
};

// User Component
const UserItem = ({ user, onSendMoney }: { user: User; onSendMoney: (user: User) => void }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors duration-200 border border-slate-200">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center font-medium">
          {getInitials(user.firstName, user.lastName)}
        </div>
        <div>
          <div className="text-slate-800 font-medium">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-slate-500 text-sm">
            {user.username}
          </div>
        </div>
      </div>
      <SendMoneyButton onClick={() => onSendMoney(user)} />
    </div>
  );
};

// Users List Component
const UsersList = ({ users, searchTerm, onSendMoney, isLoading }: { 
  users: User[]; 
  searchTerm: string; 
  onSendMoney: (user: User) => void; 
  isLoading: boolean;
}) => {
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-slate-600">Loading users...</span>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        {searchTerm ? 'No users found matching your search.' : 'No users available.'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredUsers.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onSendMoney={onSendMoney}
        />
      ))}
    </div>
  );
};

// Top Navigation Component
const TopNavigation = ({ userInfo }: { userInfo: User | null }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-800">Tu Bhar</h1>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm text-slate-600">Welcome back</div>
          <div className="text-slate-800 font-medium">
            {userInfo?.firstName} {userInfo?.lastName}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {userInfo?.username}
          </div>
        </div>
        <button
          onClick={() => navigate('/userinfo')}
          className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors duration-200"
          title="User Info"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Set default auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Fetch user data and balance
    fetchDashboardData();
    fetchUserInfo();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users
      const usersResponse = await axios.get('http://localhost:3000/api/v1/user/bulk');
      setUsers(usersResponse.data.users);
      
      // Fetch balance
      const balanceResponse = await axios.get('http://localhost:3000/api/v1/account/balance');
      setBalance(balanceResponse.data.balance);
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/signin');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/user/me');
      setUserInfo(response.data);
    } catch (error) {
      // fallback: do nothing, userInfo will remain null
    }
  };

  const handleSendMoney = (user: User) => {
    // Navigate to send money page with user data
    navigate('/send', { 
      state: { 
        recipient: user,
        balance: balance
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavigation userInfo={userInfo} />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Balance Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-6 h-6 text-cyan-600" />
              <h2 className="text-xl font-semibold text-slate-800">Your Balance</h2>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {isLoading ? (
                <div className="w-32 h-8 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                formatBalance(balance)
              )}
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Send Money</h3>
            <div className="text-sm text-slate-500">
              {users.length} users available
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Users List */}
          <UsersList
            users={users}
            searchTerm={searchTerm}
            onSendMoney={handleSendMoney}
            isLoading={isLoading}
          />
        </div>

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
          <button
            className="w-12 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
            onClick={() => navigate('/send')}
            title="Send Money"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
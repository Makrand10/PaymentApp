import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title?: string;
  showDashboard?: boolean;
  showSendMoney?: boolean;
  showLogout?: boolean;
}

export function Navbar({ 
  title = 'PayTM Clone', 
  showDashboard = false, 
  showSendMoney = false, 
  showLogout = true 
}: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {showDashboard && (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Dashboard
              </button>
            )}
            {showSendMoney && (
              <button
                onClick={() => navigate('/send')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Send Money
              </button>
            )}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
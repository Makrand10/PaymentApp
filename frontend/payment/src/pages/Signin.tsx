import { useState } from 'react';

// Simulating axios behavior for demo
const mockAxios = {
  post: async (url: string, data: any) => {
    console.log('POST to:', url, 'with data:', data);
    return {
      data: {
        token: 'mock-jwt-token',
        user: { id: 1, username: data.username }
      }
    };
  }
};


export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      // Using axios as in original code
      const response = await mockAxios.post('http://localhost:3000/api/v1/user/signin', {
        username,
        password
      });
      
      // Clear any previous errors
      setError('');
      // In real app: localStorage.setItem('token', response.data.token);
      // In real app: navigate('/dashboard');
      console.log('Signin successful:', response.data);
      alert('Signed in successfully!');
    }  catch (err: unknown) {
  const error = err as { response?: { data?: { message?: string } } };
  console.error('Signin error:', error);
  setError(error.response?.data?.message ?? 'Network error. Please try again.');
}

  };

  return (
    <div className="min-h-screen bg-gray-400 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Elevated Box Container */}
        <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
            <p className="text-gray-600">Enter your credentials to access your account.</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign in
            </button>
          </div>

          <div className="text-center mt-6">
            <a href="/signup" className="text-blue-600 hover:text-blue-500 underline transition-colors duration-200">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axiosInstance.get('/user/status');
      if (response.data.success) {
        setStatus(response.data.user);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch status');
      setMessageType('error');
    }
  };

  const handleAccessResource = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await axiosInstance.get('/user/protected-resource');
      setMessage(response.data.message);
      setMessageType('success');
      setTimeout(fetchStatus, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Access denied');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const now = new Date();
  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">User Dashboard</h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Access Status</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Current Time</p>
                <p className="text-2xl font-bold text-gray-800">
                  {now.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Access Window Start</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatDate(status.accessStart)}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Access Window End</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatDate(status.accessEnd)}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                status.hasAccess
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-red-100 border border-red-300'
              }`}>
                <p className={`text-lg font-bold ${
                  status.hasAccess ? 'text-green-800' : 'text-red-800'
                }`}>
                  {status.hasAccess ? '✓ Access Currently Active' : '✗ Access Not Active'}
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              messageType === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleAccessResource}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Attempting Access...' : 'Access Protected Resource'}
          </button>

          <div className="mt-8 text-sm text-gray-600">
            <p>
              <strong>Note:</strong> You can only access the protected resource if the
              current time falls within your access window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [accessStart, setAccessStart] = useState('');
  const [accessEnd, setAccessEnd] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  // Edit Modal State
  const [editingUserId, setEditingUserId] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      setMessage('Failed to fetch users');
      setMessageType('error');
    }
  };

  const fetchLogs = async (userId = '') => {
    try {
      const params = userId ? { userId } : {};
      const response = await axiosInstance.get('/admin/logs', { params });
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      setMessage('Failed to fetch logs');
      setMessageType('error');
    }
  };

  // CREATE - Set Access Window
  const handleSetAccessWindow = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!selectedUserId || !accessStart || !accessEnd) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.put(`/admin/access/${selectedUserId}`, {
        accessStart,
        accessEnd,
      });

      if (response.data.success) {
        setMessage('Access window set successfully!');
        setMessageType('success');
        setAccessStart('');
        setAccessEnd('');
        setSelectedUserId('');
        fetchUsers();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to set access window');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE - Edit Access Window
  const handleEditAccessWindow = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!editStart || !editEnd) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.patch(`/admin/access/${editingUserId}`, {
        accessStart: editStart,
        accessEnd: editEnd,
      });

      if (response.data.success) {
        setMessage('Access window updated successfully!');
        setMessageType('success');
        setShowEditModal(false);
        setEditingUserId(null);
        setEditStart('');
        setEditEnd('');
        fetchUsers();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update access window');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Remove Access Window
  const handleDeleteAccessWindow = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this access window?')) {
      return;
    }

    setMessage('');
    setMessageType('');
    setLoading(true);

    try {
      const response = await axiosInstance.delete(`/admin/access/${userId}`);

      if (response.data.success) {
        setMessage('Access window deleted successfully!');
        setMessageType('success');
        fetchUsers();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete access window');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (user) => {
    setEditingUserId(user.id);
    setEditStart(user.accessStart ? new Date(user.accessStart).toISOString().slice(0, 16) : '');
    setEditEnd(user.accessEnd ? new Date(user.accessEnd).toISOString().slice(0, 16) : '');
    setShowEditModal(true);
  };

  // CLOSE EDIT MODAL
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUserId(null);
    setEditStart('');
    setEditEnd('');
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            messageType === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded font-semibold ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-2 rounded font-semibold ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            Access Logs
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-8">
            {/* Create Access Window Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                CREATE - Set New Access Window
              </h2>

              <form onSubmit={handleSetAccessWindow} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - Role: {user.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Access Start
                    </label>
                    <input
                      type="datetime-local"
                      value={accessStart}
                      onChange={(e) => setAccessStart(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Access End
                    </label>
                    <input
                      type="datetime-local"
                      value={accessEnd}
                      onChange={(e) => setAccessEnd(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
                >
                  {loading ? 'Setting...' : '+ Create Access Window'}
                </button>
              </form>
            </div>

            {/* Users List with CRUD Actions */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">All Users</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Access Start</th>
                      <th className="px-4 py-2 text-left">Access End</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">
                          <span className={`px-3 py-1 rounded text-white text-sm ${
                            user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {formatDate(user.accessStart)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {formatDate(user.accessEnd)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              disabled={!user.accessStart}
                              className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 text-white py-1 px-3 rounded text-xs font-semibold transition"
                              title="Edit access window"
                            >
                              ✎ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAccessWindow(user.id)}
                              disabled={!user.accessStart}
                              className="bg-red-500 hover:bg-red-700 disabled:bg-gray-300 text-white py-1 px-3 rounded text-xs font-semibold transition"
                              title="Delete access window"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Access Logs</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">User Name</th>
                    <th className="px-4 py-2 text-left">User Email</th>
                    <th className="px-4 py-2 text-left">Attempted At</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{log.userName}</td>
                      <td className="px-4 py-2">{log.userEmail}</td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(log.attemptedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded text-white text-sm ${
                          log.success ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {log.success ? '✓ Success' : '✗ Failed'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">UPDATE - Edit Access Window</h3>

              <form onSubmit={handleEditAccessWindow} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Access Start
                  </label>
                  <input
                    type="datetime-local"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Access End
                  </label>
                  <input
                    type="datetime-local"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={loading}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

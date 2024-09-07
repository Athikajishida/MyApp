// src/components/Admin/UserForm.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';

const UserForm = ({ user, onClose, onSuccess }) => {
  const isEdit = Boolean(user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: false,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Leave password blank for editing
        role: user.admin,
      });
    }
  }, [isEdit, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`/admin/users/${user.id}`,formData);
      } else {
        await axios.post('/admin/users', {user:formData});
      }
      setMessage('Operation successful');
      onSuccess();
    } catch (error) {
      setMessage(error.response.data.error || 'Operation failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit User' : 'Create User'}</h3>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          {!isEdit && (
            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required={!isEdit}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

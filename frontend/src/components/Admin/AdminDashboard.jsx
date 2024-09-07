import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, blockUser } from '../../redux/userSlice';
import UserList from './UserList';
import UserForm from './UserForm';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBlock = (userId) => {
    dispatch(blockUser(userId));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      {/* Search and Create */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create User
        </button>
      </div>

      {/* User List */}
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <UserList users={filteredUsers} onBlock={handleBlock} onEdit={handleEdit} />
      )}

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            dispatch(fetchUsers());
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

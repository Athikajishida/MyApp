import React from 'react';

const UserList = ({ users = [], onBlock, onEdit }) => {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="py-2 px-4 border">ID</th>
          <th className="py-2 px-4 border">Name</th>
          <th className="py-2 px-4 border">Email</th>
          <th className="py-2 px-4 border">Role</th>
          <th className="py-2 px-4 border">Blocked</th>
          <th className="py-2 px-4 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="text-center">
            <td className="py-2 px-4 border">{user.id}</td>
            <td className="py-2 px-4 border">{user.name}</td>
            <td className="py-2 px-4 border">{user.email}</td>
            <td className="py-2 px-4 border">{user.admin ? 'Admin' : 'User'}</td>
            <td className="py-2 px-4 border">{user.blocked ? 'Yes' : 'No'}</td>
            <td className="py-2 px-4 border">
              <button
                onClick={() => onBlock(user.id)}
                className={`w-20 px-1.5 py-1 rounded ${
                  user.blocked ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                } mr-2`}
              >
                {user.blocked ? 'Unblock' : 'Block'}
              </button>
              <button
                onClick={() => onEdit(user)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../utils/axiosInstance';

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(auth.user);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch latest user data if needed
    // Optionally, you can implement this
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('user[name]', userData.name);
      formData.append('user[email]', userData.email);
      if (profileImage) {
        formData.append('user[profile_image]', profileImage);
      }
  
      const response = await axios.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
  
      setUserData(response.data.user);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error.response.data.error || 'Failed to update profile');
    }
  };
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
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
            value={userData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img src={preview} alt="Profile Preview" className="mt-2 h-32 w-32 object-cover rounded-full" />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;

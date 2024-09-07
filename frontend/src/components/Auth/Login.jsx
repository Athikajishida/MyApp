import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, adminLogin } from '../../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isAdminLogin ? adminLogin : login;
    const resultAction = await dispatch(action(formData));
    if (action.fulfilled.match(resultAction)) {
      navigate('/');
    } else {
      // Handle login failure
      console.error('Login failed:', resultAction.payload);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isAdminLogin ? 'Admin Login' : 'Login'}</h2>
      {auth.error && <p className="text-red-500 mb-4">{auth.error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAdminLogin}
              onChange={() => setIsAdminLogin(!isAdminLogin)}
              className="mr-2"
            />
            Login as Admin
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={auth.loading}
        >
          {auth.loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
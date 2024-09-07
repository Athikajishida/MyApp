import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Welcome, {auth.user.name}!</h1>
      <p className="mt-4">This is your home page.</p>
    </div>
  );
};

export default Home;

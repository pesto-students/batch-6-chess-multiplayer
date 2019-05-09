/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../../auth/auth';

const Dashboard = (props) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    auth.fetchUserData()
      .then((data) => {
        const { name } = data.user;
        setUserName(name);
      })
      .catch(() => {
        props.history.push('/login');
      });
  });

  const handleLogout = () => {
    auth.logout(() => {
      props.history.push('/login');
    });
  };
  return (
    <>
      <div>Dashboard</div>
      <div>
        Hello
        {' '}
        { userName }
      </div>
      <Link to="/">Home</Link>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default Dashboard;

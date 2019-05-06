/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import auth from '../../auth/auth';

const Dashboard = (props) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    axios.get(process.env.REACT_APP_DASHBOARD_URL, {
      headers: {
        'x-auth-token': localStorage.getItem('jwt'),
      },
    })
      .then((res) => {
        setUserName(res.data);
      })
      .catch(() => {
        props.history.push('/login');
      });
  });
  return (
    <>
      <div>Dashboard</div>
      <div>
        Hello
        {' '}
        { userName }
      </div>
      <Link to="/">Home</Link>
      <button
        type="button"
        onClick={() => {
          auth.logout(() => {
            props.history.push('/login');
          });
        }}
      >
  Logout
      </button>
    </>
  );
};

export default Dashboard;

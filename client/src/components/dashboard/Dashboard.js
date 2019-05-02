/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import auth from '../../auth/auth';

const Dashboard = props => (
  <>
    <div>Dashboard</div>
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

export default Dashboard;

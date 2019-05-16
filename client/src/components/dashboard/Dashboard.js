/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import config from '../../config/globalConfig';

export default function Dashboard() {
  return (
    <div id="home-screen-wrapper">
      <div className="dashboard-img" />
      <div className="centered-dashboard-text">
        {'Click '}
        <Link to={config.chessGameRoute}>here</Link>
        { ' to play' }
      </div>
    </div>
  );
}

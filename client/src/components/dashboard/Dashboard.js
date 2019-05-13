/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div id="home-screen-wrapper">
      <p>
        {'Click '}
        <Link to="/chess-game">here</Link>
        { ' to play' }
      </p>
    </div>
  );
}

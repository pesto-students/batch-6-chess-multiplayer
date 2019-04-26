import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
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

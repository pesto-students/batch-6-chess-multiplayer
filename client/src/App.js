import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ChessGame from './components/chess-game/ChessGame';
import Home from './components/home/Home';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/chess-game" exact component={ChessGame} />
    </Router>
  );
}

export default App;

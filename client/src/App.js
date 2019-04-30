import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ChessGame from './components/chess-game/ChessGame';
import Home from './components/home/Home';
import Login from './components/login/Login';

function App() {
  return (
    <Router>
      <Route path="/login" exact component={Login} />
      <Route path="/" exact component={Home} />
      <Route path="/chess-game" exact component={ChessGame} />
    </Router>
  );
}

export default App;

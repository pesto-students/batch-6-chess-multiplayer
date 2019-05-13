import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import ProtectedRoute from './components/routes/ProtectedRoute';
import ChessGame from './components/chess-game/ChessGame';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Leaderboard from './components/leaderboard/Leaderboard';
import MenuBar from './components/menu-bar/MenuBar';

function App() {
  return (
    <Router>
      <Route component={MenuBar} />
      <Switch>
        <Route path="/" exact component={Login} />
        <ProtectedRoute path="/dashboard" exact component={Dashboard} />
        <ProtectedRoute path="/chess-game" exact component={ChessGame} />
        <ProtectedRoute path="/leaderboard" exact component={Leaderboard} />
        <Route path="*" component={() => '404 NOT FOUND'} />
      </Switch>
    </Router>
  );
}

export default App;

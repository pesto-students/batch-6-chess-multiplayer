import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import ProtectedRoute from './components/routes/ProtectedRoute';
import ChessGame from './components/chess-game/ChessGame';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/chess-game" exact component={ChessGame} />
        <Route path="/" exact component={Home} />
        <ProtectedRoute path="/dashboard" exact component={Dashboard} />
        <Route path="*" component={() => '404 NOT FOUND'} />
      </Switch>
    </Router>
  );
}

export default App;

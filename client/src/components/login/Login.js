import React from 'react';
import './login.css';
import GoogleButton from './google-button/GoogleButton';

const Login = props => (
  <div id="content">
    <p>Multiplayer Chess</p>
    <GoogleButton {...props} />
  </div>
);

export default Login;

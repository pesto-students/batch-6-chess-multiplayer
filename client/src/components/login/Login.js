import React from 'react';
import './login.css';
import GoogleButton from './google-button/GoogleButton';
import FacebookButton from './FacebookButton';

const Login = props => (
  <div id="content">
    <p>Multiplayer Chess</p>
    <GoogleButton {...props} />
    <FacebookButton {...props} />
  </div>
);

export default Login;

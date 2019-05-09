import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';
import GoogleButton from './google-button/GoogleButton';
import FacebookButton from './FacebookButton';

const Login = (props) => {
  const [errorMessage, setErrorMessage] = useState('');

  const failureCallback = (_errorMessage) => {
    setErrorMessage(_errorMessage);
  };

  const successCallback = (res) => {
    const { loggedIn } = res;
    if (loggedIn) {
      props.history.push('/dashboard');
    } else {
      failureCallback('Please try again');
    }
  };

  return (
    <div id="content">
      <p>Multiplayer Chess</p>
      { errorMessage && <p>{errorMessage}</p> }
      <GoogleButton successCallback={successCallback} failureCallback={failureCallback} />
      <FacebookButton successCallback={successCallback} failureCallback={failureCallback} />
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Login;

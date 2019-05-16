import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import './login.css';
import GoogleButton from './google-button/GoogleButton';
import FacebookButton from './FacebookButton';
import config from '../../config/globalConfig';
import auth from '../../auth/auth';

const Login = (props) => {
  const [errorMessage, setErrorMessage] = useState('');

  const failureCallback = (_errorMessage) => {
    setErrorMessage(_errorMessage);
  };

  const successCallback = (res) => {
    const { loggedIn } = res;
    if (loggedIn) {
      props.history.push(config.dashboardRoute);
    } else {
      failureCallback('Please try again');
    }
  };

  if (auth.isAuthenticated()) {
    return <Redirect to={{ pathname: config.dashboardRoute }} />;
  }

  return (
    <div id="content">
      <p>Online Chess</p>
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

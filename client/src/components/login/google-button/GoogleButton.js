import React from 'react';
import { GoogleLogin } from 'react-google-login';
import PropTypes from 'prop-types';
import auth from '../../../auth/auth';

const GoogleButton = (props) => {
  const { successCallback, failureCallback } = props;
  const onSuccess = (response) => {
    auth.login('google', response.Zi.id_token)
      .then((res) => {
        successCallback(res);
      })
      .catch(err => failureCallback(err.message));
  };

  const onFailure = (response) => {
    failureCallback(response.message);
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
    />
  );
};

GoogleButton.propTypes = {
  successCallback: PropTypes.func.isRequired,
  failureCallback: PropTypes.func.isRequired,
};

export default GoogleButton;

import React from 'react';
import { GoogleLogin } from 'react-google-login';
import PropTypes from 'prop-types';
import auth from '../../../auth/auth';

const GoogleButton = (props) => {
  const onSuccess = (response) => {
    // TODO: 'post' call to Server with the id_token from response
    // console.log(response); // Placeholder till server code is integrated.
    auth.login(response.Zi.id_token, () => {
      props.history.push('/dashboard');
    });
  };
  const onFailure = (response) => {
    // TODO:handle failure response
    console.log(response); // Placeholder till server code is integrated.
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
  history: PropTypes.any.isRequired,
};

export default GoogleButton;

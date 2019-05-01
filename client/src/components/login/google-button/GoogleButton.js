import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleButton = () => {
  const onSuccess = (response) => {
    // TODO: 'post' call to Server with the id_token from response
    console.log(response); // Placeholder till server code is integrated.
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
      theme="dark"
    />
  );
};

export default GoogleButton;

import React from 'react';
import FacebookLogin from 'react-facebook-login';
import PropTypes from 'prop-types';
import auth from '../../auth/auth';


const FacebookButton = (props) => {
  const onSuccess = (response) => {
    // TODO: 'post' call to Server with the auth_token from response
    console.log(response); // Placeholder till server code is integrated.
    auth.login(response.accessToken, () => {
      props.history.push('/dashboard');
    });
  };
  const onFailure = (reason) => {
    // TODO:handle failure response
    console.log(reason); // Placeholder till server code is integrated.
  };

  return (
    <div className="login-button-container">
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        callback={onSuccess}
        onFailure={onFailure}
        size="medium"
        icon="fa-facebook-f"
        version="3.3"
      />
    </div>
  );
};

FacebookButton.propTypes = {
  history: PropTypes.any.isRequired,
};

export default FacebookButton;

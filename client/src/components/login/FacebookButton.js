import React from 'react';
import FacebookLogin from 'react-facebook-login';
import PropTypes from 'prop-types';
import auth from '../../auth/auth';


const FacebookButton = (props) => {
  const onSuccess = (response) => {
    auth.login('facebook', response.accessToken, () => {
      props.history.push('/dashboard');
    });
  };
  const onFailure = () => {
    // TODO: Show error screen when implemented
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

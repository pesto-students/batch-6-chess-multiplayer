import React from 'react';
import FacebookLogin from 'react-facebook-login';
import PropTypes from 'prop-types';
import auth from '../../auth/auth';


const FacebookButton = (props) => {
  const { successCallback, failureCallback } = props;
  const onSuccess = (response) => {
    auth.login('facebook', response.accessToken)
      .then((res) => {
        successCallback(res);
      })
      .catch(err => failureCallback(err.message));
  };

  const onFailure = (response) => {
    failureCallback(response.message);
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
  successCallback: PropTypes.func.isRequired,
  failureCallback: PropTypes.func.isRequired,
};

export default FacebookButton;

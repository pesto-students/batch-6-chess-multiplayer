// TODO: Add PropTypes
/* eslint-disable react/prop-types */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../../auth/auth';
import config from '../../config/globalConfig';

const renderComponentIfLoggedIn = (props, Component) => {
  if (auth.isAuthenticated()) {
    return <Component {...props} />;
  }
  const { location } = props;
  return <Redirect to={{ pathname: config.loginRoute, state: { from: location } }} />;
};

function ProtectedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => renderComponentIfLoggedIn(props, Component)}
    />
  );
}


export default ProtectedRoute;

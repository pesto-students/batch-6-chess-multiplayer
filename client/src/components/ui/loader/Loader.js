import React from 'react';
import PropTypes from 'prop-types';
import loaderSvg from '../assets';
import './loader.css';

const Loader = (props) => {
  const { height, width } = props;
  const loaderContainer = {
    background: 'transparent',
    height: `${height}%`,
    width: `${width}%`,
  };
  return (
    <div style={loaderContainer}>
      <div className="loader">
        <img src={loaderSvg} alt="loader" />
        <p className="loader-caption">
        Finding opponent for you
        </p>
      </div>
    </div>
  );
};

Loader.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default Loader;

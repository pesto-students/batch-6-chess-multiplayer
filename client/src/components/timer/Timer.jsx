import React from 'react';
import PropTypes from 'prop-types';
import { convertSecToMinSecStr } from '../../utils/timeUtil';
import './timer.css';

function Timer(props) {
  const { time, classes, isActive } = props;
  let className = `timer ${classes}`;
  className += isActive ? ' active-timer' : '';
  const timeString = convertSecToMinSecStr(time);
  return (
    <span className={className}>{timeString}</span>
  );
}

Timer.propTypes = {
  time: PropTypes.number,
  classes: PropTypes.string,
  isActive: PropTypes.bool,
};

Timer.defaultProps = {
  time: 0,
  classes: '',
  isActive: false,
};

export default Timer;

import React from 'react';
import PropTypes from 'prop-types';
import { convertSecToMinSecStr } from '../../utils/timeUtil';
import './timer.css';

function Timer(props) {
  const { time, classes } = props;
  const className = `timer ${classes}`;
  const timeString = convertSecToMinSecStr(time);
  return (
    <span className={className}>{timeString}</span>
  );
}

Timer.propTypes = {
  time: PropTypes.number,
  classes: PropTypes.string,
};

Timer.defaultProps = {
  time: 0,
  classes: '',
};

export default Timer;

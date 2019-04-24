import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { convertSecToMinSecStr } from '../../utils/timeUtil';
import './timer.css';

class Timer extends PureComponent {
  render() {
    const { time, className } = this.props;
    const timeString = convertSecToMinSecStr(time);
    return (
      <span className={className}>{timeString}</span>
    );
  }
}

Timer.propTypes = {
  time: PropTypes.number,
  className: PropTypes.string,
};

Timer.defaultProps = {
  time: 0,
  className: 'timer',
};

export default Timer;

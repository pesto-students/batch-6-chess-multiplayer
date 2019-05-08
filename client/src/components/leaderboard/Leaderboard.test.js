import React from 'react';
import { shallow } from 'enzyme';
import Leaderboard from './Leaderboard';

describe('<Leaderboard />', () => {
  const wrapper = shallow(<Leaderboard />);
  it('should have property renderTableBody', () => {
    const instance = wrapper.instance();
    expect(Object.hasOwnProperty.call(instance, 'renderTableBody')).toBe(true);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import ChessSquare from './ChessSquare';

describe('<ChessSquare />', () => {
  const fn = () => true;

  test('should render empty dark unhighlighted chess square', () => {
    const wrapper = shallow(<ChessSquare isDark gridPosition="a7" highlight={false} handleSelect={fn} />);
    expect(wrapper.prop('className')).toBe('dark-square');
    expect(wrapper.prop('grid-position')).toBe('a7');
  });

  test('should render empty light unhighlighted chess square', () => {
    const wrapper = shallow(<ChessSquare isDark={false} gridPosition="a7" highlight={false} handleSelect={fn} />);
    expect(wrapper.prop('className')).toBe('light-square');
  });

  test('should render chess square with piece', () => {
    const wrapper = shallow(<ChessSquare isDark pieceType="b" pieceColor="b" gridPosition="c8" highlight={false} />);
    expect(wrapper.props().children.type).toBe('img');
    expect(wrapper.props().children.props.src).toBe('blackbishop.svg');
  });

  test('should render highlighted square', () => {
    const wrapper = shallow(<ChessSquare isDark pieceType="b" pieceColor="b" gridPosition="c8" highlight />);
    expect(wrapper.props().className).toBe('dark-square square-highlight');
  });
});

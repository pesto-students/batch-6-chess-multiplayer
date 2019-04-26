import React from 'react';
import { shallow } from 'enzyme';
import ChessGame from './ChessGame';
import ChessBoard from '../chess-board/ChessBoard';

describe('<ChessGame />', () => {
  const wrapper = shallow(<ChessGame />);

  it('Should render ChessBoard', () => {
    expect(wrapper.find(ChessBoard)).toHaveLength(1);
  });

  it('Should have hidden overlay', () => {
    const overLayDiv = wrapper.find('#game-over-overlay').at(0);
    const { style } = overLayDiv.props();
    expect(style.display).toBe('none');
  });

  it('Should display overlay after game over', () => {
    wrapper.setState({ isGameOver: true });
    const overLayDiv = wrapper.find('#game-over-overlay').at(0);
    const { style } = overLayDiv.props();
    expect(style.display).toBe('block');
  });
});

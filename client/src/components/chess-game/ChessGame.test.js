import React from 'react';
import { shallow } from 'enzyme';
import ChessGame from './ChessGame';
import ChessBoard from '../chess-board/ChessBoard';
import Timer from '../timer/Timer';

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

describe('<ChessGame /> game and timer tests', () => {
  it('Renders a <ChessBoard /> component', () => {
    const cg = shallow(<ChessGame />);
    expect(cg.exists(ChessBoard)).toBe(true);
    expect(cg.find(ChessBoard)).toHaveLength(1);
  });

  it('Renders two <Timer /> component', () => {
    const cg = shallow(<ChessGame />);
    expect(cg.exists(Timer)).toBe(true);
    expect(cg.find(Timer)).toHaveLength(2);
  });

  function getTimerAndCB(shallowWrapper) {
    const isTimer = shallowWrapper.is(Timer);
    const isChessBoard = shallowWrapper.is(ChessBoard);
    return isTimer || isChessBoard;
  }

  it('Renders <ChessBoard /> component in between <Timer /> components', () => {
    const cg = shallow(<ChessGame />);
    const children = cg.findWhere(getTimerAndCB);
    expect(children).toHaveLength(3);
    expect(children.at(0).is(Timer)).toBe(true);
    expect(children.at(1).is(ChessBoard)).toBe(true);
    expect(children.at(2).is(Timer)).toBe(true);
  });
});

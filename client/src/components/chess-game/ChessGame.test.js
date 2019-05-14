import React from 'react';
import { shallow } from 'enzyme';
import { Chess } from 'chess.js';
import ChessGame from './ChessGame';
import ChessBoard from '../chess-board/ChessBoard';
import GameOverOverLay from '../game-over-overlay/GameOverOverlay';
import Timer from '../timer/Timer';
import Loader from '../ui/loader/Loader';


const chess = new Chess();
describe('<ChessGame />', () => {
  const wrapper = shallow(<ChessGame />);

  const componentExistsTest = (componentWrapper, Component, exists, length) => {
    expect(componentWrapper.exists(Component)).toBe(exists);
    expect(componentWrapper.find(Component)).toHaveLength(length);
  };

  it('Should render <Loader /> component if game is not ready', () => {
    wrapper.setState({ gameReady: false });
    componentExistsTest(wrapper, Loader, true, 1);
  });

  it('Should not render <ChessBoard /> component until game is ready', () => {
    componentExistsTest(wrapper, ChessBoard, false, 0);
  });

  it('Renders a <ChessBoard /> component', () => {
    wrapper.setState({ gameReady: true });
    componentExistsTest(wrapper, ChessBoard, true, 1);
  });


  it('Should render render ChessBoard in correct orientation for player with black pieces', () => {
    wrapper.setState({ playerColor: 'b', board: chess.board() });
    const chessBoard = wrapper.find(ChessBoard);
    expect(chessBoard.prop('squares')[0]).toBe('h1');
    expect(chessBoard.prop('board')[0][0]).toEqual({ type: 'r', color: 'w' });
  });

  it('Renders two <Timer /> component', () => {
    componentExistsTest(wrapper, Timer, true, 2);
  });

  function getTimerAndCB(shallowWrapper) {
    const isTimer = shallowWrapper.is(Timer);
    const isChessBoard = shallowWrapper.is(ChessBoard);
    return isTimer || isChessBoard;
  }

  it('Renders <ChessBoard /> component in between <Timer /> components', () => {
    const children = wrapper.findWhere(getTimerAndCB);
    expect(children).toHaveLength(3);
    expect(children.at(0).is(Timer)).toBe(true);
    expect(children.at(1).is(ChessBoard)).toBe(true);
    expect(children.at(2).is(Timer)).toBe(true);
  });

  it('Should not render <GameOverOverLay /> when mounted', () => {
    componentExistsTest(wrapper, GameOverOverLay, false, 0);
  });

  it('Should render <GameOverOverLay /> overlay after game over', () => {
    wrapper.setState({ isGameOver: true, chessBoardWidth: 1, chessBoardHeight: 2 });
    componentExistsTest(wrapper, GameOverOverLay, true, 1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';
import { WHITE_PLAYER } from '../../config/chess-game';

const chess = new Chess();
const squares = chess.SQUARES;
const board = chess.board();

describe('<ChessBoard />', () => {
  describe('generateGrid()', () => {
    const wrapper = shallow(
      <ChessBoard
        calcPossibleMoves={() => true}
        squares={squares}
        board={board}
        movePiece={() => true}
        playerColor={WHITE_PLAYER}
      />,
    );
    const instance = wrapper.instance();
    test('generateGrid() should exist', () => {
      expect(Object.hasOwnProperty.call(instance, 'generateGrid')).toBe(true);
    });

    test('should return null if board is empty array', () => {
      const grid = instance.generateGrid(squares, []);
      expect(grid).toBeNull();
    });
    const grid = instance.generateGrid(squares, board);

    test('should return grid containing 64 chess squares', () => {
      expect(grid.length).toBe(64);
      expect(grid[0].type.name).toBe('ChessSquare');
    });
  });

  describe('handleSquareClick()', () => {
    const possibleMoves = () => chess.moves({ verbose: true });
    const movePiece = (move) => {
      chess.move(move);
    };
    const wrapper = shallow(
      <ChessBoard
        calcPossibleMoves={possibleMoves}
        movePiece={movePiece}
        squares={squares}
        board={board}
      />,
    );
    const { handleSquareClick } = wrapper.instance();
    const testBoardState = (nextGridPosition, prevSelectValidTouch) => {
      handleSquareClick(nextGridPosition);
      expect(wrapper.state('prevSelectValidTouch')).toBe(prevSelectValidTouch);
    };

    test('should change "prevSelectValidTouch"', () => {
      handleSquareClick('e4');
      expect(wrapper.state('prevSelectValidTouch')).toBe(true);
    });

    test('should reset state when piece is moved', () => {
      testBoardState('e3', false);
    });

    test('should not change the state when square with no valid moves is clicked', () => {
      testBoardState('e3', true);
      testBoardState('e7', true);
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';

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
    const { moves } = chess;
    const movePiece = (from, to) => {
      chess.move(to);
    };
    const wrapper = shallow(
      <ChessBoard
        calcPossibleMoves={moves}
        movePiece={movePiece}
        squares={squares}
        board={board}
      />,
    );
    const { handleSquareClick } = wrapper.instance();
    const testBoardState = (nextGridPosition, from, prevSelectValidTouch) => {
      handleSquareClick(nextGridPosition);
      expect(wrapper.state('from')).toBe(from);
      expect(wrapper.state('prevSelectValidTouch')).toBe(prevSelectValidTouch);
    };

    test('should set the state property \'from\' to the provided gridPosition object when square with piece is clicked', () => {
      const gridPosition = 'e2';
      testBoardState(gridPosition, 'e2', true);
    });

    test('should reset state when piece is moved', () => {
      expect(wrapper.state('from')).toBe('e2');
      testBoardState('e3', '', false);
    });

    test('should not change the state when square with no valid moves is clicked', () => {
      expect(wrapper.state('from')).toBe('');
      testBoardState('e7', 'e7', true);
      testBoardState('e3', 'e7', true);
    });
  });
});

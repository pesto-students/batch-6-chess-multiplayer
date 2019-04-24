import React from 'react';
import PropTypes from 'prop-types';
import Chess from 'chess.js';
import './chessboard.css';

const chess = new Chess();
const squares = chess.SQUARES;

const ChessSquare = ({ isDark, gridPosition }) => {
  const handleClick = (e) => {
    const selectedSquare = { square: e.target.getAttribute('grid-position') };
    return selectedSquare;
  };

  return (
    <div role="button" tabIndex={0} onKeyPress={handleClick} onClick={handleClick} grid-position={gridPosition} className={isDark ? 'dark-square' : 'light-square'} />
  );
};

ChessSquare.propTypes = {
  isDark: PropTypes.bool.isRequired,
  gridPosition: PropTypes.string.isRequired,
};

const generateGrid = (playerColor) => {
  let squaresOrder = squares.slice(0);
  if (playerColor === 'black') {
    squaresOrder = squaresOrder.reverse();
  }
  return squaresOrder.map((x, index) => {
    const row = parseInt(x[1], 10);
    if (row % 2 === 0) {
      const isDark = ((index + 1) % 2) === 0;
      return (<ChessSquare key={x} gridPosition={x} isDark={isDark} />);
    }
    const isDark = ((index) % 2) === 0;
    return (<ChessSquare key={x} gridPosition={x} isDark={isDark} />);
  });
};

const ChessBoard = ({ playerColor }) => (<div className="chess-board">{generateGrid(playerColor)}</div>);

ChessBoard.propTypes = {
  playerColor: PropTypes.string,
};

ChessBoard.defaultProps = {
  playerColor: 'white',
};

export default ChessBoard;

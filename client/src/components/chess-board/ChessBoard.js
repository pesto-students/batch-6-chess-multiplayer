import React from 'react';
import PropTypes from 'prop-types';
import './ChessBoard.css';
import ChessSquare from '../chess-square/ChessSquare';

const matchingStringInArray = array => str => array.some(x => x === str);

class ChessBoard extends React.Component {
  state = {
    possibleMoves: [],
    from: '',
    prevSelectValidTouch: false,
  };

  generateGrid = (squares, board) => {
    if (board.length === 0) {
      return null;
    }
    const { possibleMoves } = this.state;
    const isValidPosition = matchingStringInArray(possibleMoves);
    return squares.map((position, index) => {
      const row = parseInt(index / 8, 10);
      const col = index % 8;
      const isDark = row % 2 === 0 ? col % 2 === 1 : col % 2 === 0;
      const { type = null, color = null } = board[row][col] || {};
      const highlight = isValidPosition(position);

      return (
        <ChessSquare
          key={position}
          handleSelect={this.handleSquareClick}
          gridPosition={position}
          isDark={isDark}
          pieceType={type}
          pieceColor={color}
          highlight={highlight}
        />
      );
    });
  }

  handleSquareClick = (gridPosition) => {
    const { possibleMoves, prevSelectValidTouch, from } = this.state;
    const { movePiece } = this.props;
    const isValidMove = matchingStringInArray(possibleMoves)(gridPosition);

    if (prevSelectValidTouch && isValidMove) {
      movePiece(from, gridPosition);
      this.setState({ possibleMoves: [], from: '', prevSelectValidTouch: false });
    } else {
      this.updatePossibleMoves(gridPosition);
    }
  }

  updatePossibleMoves = (gridPosition) => {
    const { calcPossibleMoves } = this.props;
    const possibleMoves = calcPossibleMoves({ square: gridPosition });
    if (possibleMoves.length > 0) {
      this.setState({ possibleMoves, from: gridPosition, prevSelectValidTouch: true });
    }
  }

  render() {
    const { squares, board } = this.props;
    return (
      <div className="chess-board">
        {this.generateGrid(squares, board)}
      </div>
    );
  }
}

ChessBoard.propTypes = {
  calcPossibleMoves: PropTypes.func.isRequired,
  movePiece: PropTypes.func.isRequired,
  squares: PropTypes.array,
  board: PropTypes.array,
};

ChessBoard.defaultProps = {
  squares: [],
  board: [],
};

export default ChessBoard;

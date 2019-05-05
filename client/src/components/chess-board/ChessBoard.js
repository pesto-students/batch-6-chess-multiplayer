import React from 'react';
import PropTypes from 'prop-types';
import './ChessBoard.css';
import ChessSquare from '../chess-square/ChessSquare';
import PawnPromotion from './PawnPromotion';

const matchPossibleMoves = moveArray => position => moveArray.some(move => move.to === position);

class ChessBoard extends React.Component {
  state = {
    possibleMoves: [],
    prevSelectValidTouch: false,
    showPromotion: false,
    promotionTo: null,
  };

  generateGrid = (squares, board) => {
    if (board.length === 0) {
      return null;
    }
    const { possibleMoves } = this.state;
    const isValidPosition = matchPossibleMoves(possibleMoves);
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
  };

  handleSquareClick = (gridPosition) => {
    const { possibleMoves, prevSelectValidTouch } = this.state;
    const { movePiece } = this.props;
    const move = possibleMoves.find(mv => mv.to === gridPosition);
    if (prevSelectValidTouch && move) {
      if (move.promotion) {
        this.setState({ showPromotion: true, promotionTo: move.to });
      } else {
        movePiece(move);
        this.setState({ possibleMoves: [], prevSelectValidTouch: false });
      }
    } else {
      this.updatePossibleMoves(gridPosition);
    }
  };

  updatePossibleMoves = (gridPosition) => {
    const { calcPossibleMoves } = this.props;
    const possibleMoves = calcPossibleMoves({ square: gridPosition });
    if (possibleMoves.length > 0) {
      this.setState({ possibleMoves, prevSelectValidTouch: true });
    }
  };

  makePromotionMove = (selectedPromotionPiece) => {
    const { movePiece } = this.props;
    const { promotionTo, possibleMoves } = this.state;
    const move = possibleMoves.find(
      mv => mv.to === promotionTo && mv.promotion === selectedPromotionPiece,
    );
    movePiece(move);
    this.setState({
      possibleMoves: [],
      prevSelectValidTouch: false,
      promotionTo: null,
      showPromotion: false,
    });
  };

  render() {
    const {
      chessBoardContainerRef, playerColor, squares, board,
    } = this.props;
    const { showPromotion } = this.state;
    const promotionDisplay = showPromotion ? 'block' : 'none';
    return (
      <div ref={chessBoardContainerRef} className="chess-board">
        {this.generateGrid(squares, board)}
        <div className="promotion-wrapper" style={{ display: promotionDisplay }}>
          <PawnPromotion onSelect={this.makePromotionMove} pieceColor={playerColor} />
        </div>
      </div>
    );
  }
}

ChessBoard.propTypes = {
  board: PropTypes.array,
  calcPossibleMoves: PropTypes.func.isRequired,
  movePiece: PropTypes.func.isRequired,
  playerColor: PropTypes.string.isRequired,
  squares: PropTypes.array,
  chessBoardContainerRef: PropTypes.object,
};

ChessBoard.defaultProps = {
  board: [],
  squares: [],
  chessBoardContainerRef: {},
};

export default ChessBoard;

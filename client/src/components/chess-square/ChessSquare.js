import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './ChessSquare.css';
import chessPieces from './chess-pieces';

class ChessSquare extends PureComponent {
  handleSqClick = () => {
    const {
      handleSelect, gridPosition, pieceColor,
    } = this.props;
    handleSelect(gridPosition, pieceColor);
  }

  render() {
    let piece = '';
    const {
      isDark, highlight, pieceType, pieceColor, gridPosition, isPrevMoveSq,
    } = this.props;
    const key = `${pieceColor}${pieceType}`;
    if (Object.hasOwnProperty.call(chessPieces, key)) {
      piece = chessPieces[key];
    }
    let squareClass = isDark ? 'dark-square' : 'light-square';
    squareClass += highlight ? ' square-highlight' : '';

    return (
      <div
        role="button"
        tabIndex={0}
        onKeyPress={this.handleSqClick}
        onClick={this.handleSqClick}
        grid-position={gridPosition}
        className={squareClass}
      >
        {piece ? <img src={piece} alt="chess_piece" /> : null}
        {isPrevMoveSq ? <div className="inner-square" /> : null}
      </div>
    );
  }
}

ChessSquare.propTypes = {
  gridPosition: PropTypes.string.isRequired,
  highlight: PropTypes.bool,
  handleSelect: PropTypes.func.isRequired,
  isDark: PropTypes.bool,
  pieceType: PropTypes.string,
  pieceColor: PropTypes.string,
  isPrevMoveSq: PropTypes.bool,
};

ChessSquare.defaultProps = {
  highlight: false,
  isDark: false,
  pieceType: null,
  pieceColor: null,
  isPrevMoveSq: false,
};

export default ChessSquare;

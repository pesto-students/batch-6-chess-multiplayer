import React from 'react';
import PropTypes from 'prop-types';
import './ChessSquare.css';
import chessPieces from './chess-pieces';

class ChessSquare extends React.Component {
  handleSqClick = () => {
    const { handleSelect, gridPosition } = this.props;
    handleSelect(gridPosition);
  }

  render() {
    let piece = '';
    const {
      isDark, highlight, pieceType, pieceColor, gridPosition,
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
      </div>
    );
  }
}

ChessSquare.propTypes = {
  isDark: PropTypes.bool.isRequired,
  gridPosition: PropTypes.string.isRequired,
  pieceType: PropTypes.string,
  pieceColor: PropTypes.string,
  highlight: PropTypes.bool.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

ChessSquare.defaultProps = {
  pieceType: '',
  pieceColor: '',
};

export default ChessSquare;

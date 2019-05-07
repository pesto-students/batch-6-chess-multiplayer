import React from 'react';
import PropTypes from 'prop-types';
import ChessSquare from '../chess-square/ChessSquare';
import './PawnPromotion.css';
import { PROMOTION_PIECES } from '../../config/chess-game';

function PawnPromotion({ onSelect, pieceColor }) {
  return (
    <div className="pawn-promotion-board">
      {
        PROMOTION_PIECES.map(pieceType => <ChessSquare pieceColor={pieceColor} pieceType={pieceType} key={pieceType} handleSelect={() => onSelect(pieceType)} gridPosition="" />)
      }
    </div>
  );
}

PawnPromotion.propTypes = {
  onSelect: PropTypes.func.isRequired,
  pieceColor: PropTypes.string.isRequired,
};

export default PawnPromotion;

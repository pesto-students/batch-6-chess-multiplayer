import React from 'react';
import ChessJs from 'chess.js';
import ChessBoard from '../chess-board/ChessBoard';
import { WHITE_PLAYER } from '../../config/chess-game';
import './ChessGame.css';

/** Following if condition is for Chess.js Module,
 * Chess.js export exports different Object based on environment
 * While testing it exports object
 * and while running server or building server it exports function
*/
const Chess = typeof ChessJs === 'function' ? ChessJs : ChessJs.Chess;

const INIT_STATE = {
  board: [],
  currentPlayer: WHITE_PLAYER,
  isGameOver: false,
  gameOverMessage: '',
};

export default class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, INIT_STATE);
    this.startGame = this.startGame.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.updateBoardState = this.updateBoardState.bind(this);
    this.calcPossibleMoves = this.calcPossibleMoves.bind(this);
  }

  componentDidMount() {
    this.startGame();
  }

  startGame() {
    this.chess = new Chess();
    this.squares = this.chess.SQUARES;
    const board = this.chess.board();
    const currentPlayer = this.chess.turn();
    this.setState(Object.assign({}, INIT_STATE, { board, currentPlayer }));
  }

  movePiece(from, to) {
    this.chess.move({ from, to });
    this.updateBoardState();
  }

  updateBoardState() {
    const board = this.chess.board();
    const currentPlayer = this.chess.turn();
    // eslint-disable-next-line react/no-unused-state
    this.setState({ board, currentPlayer });
  }

  calcPossibleMoves(param) {
    return this.chess.moves(param);
  }

  render() {
    const {
      board,
      isGameOver,
      gameOverMessage,
    } = this.state;
    const { squares } = this;
    return (
      <>
        <div id="chess-game-container">
          <ChessBoard
            calcPossibleMoves={this.calcPossibleMoves}
            movePiece={this.movePiece}
            squares={squares}
            board={board}
            playerColor={WHITE_PLAYER}
          />
          <div id="game-over-overlay" style={{ display: isGameOver ? 'block' : 'none' }}>
            <p>{ gameOverMessage }</p>
            <button type="button" onClick={this.startGame}>Play Again</button>
          </div>
        </div>
      </>
    );
  }
}

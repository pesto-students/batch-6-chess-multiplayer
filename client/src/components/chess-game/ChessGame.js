import React from 'react';
import ChessJs from 'chess.js';
import ChessBoard from '../chess-board/ChessBoard';
import { BLACK_PLAYER, DEFAULT_GAME_TIME_SECS, WHITE_PLAYER } from '../../config/chess-game';
import Timer from '../timer/Timer';
import {
  createConnection,
  receiveGameData,
  sendMove,
  receiveMove,
  disconnect,
} from '../../apis/chessSockets';
import './ChessGame.css';

/** Following if condition is for Chess.js Module,
 * Chess.js export exports different Object based on environment
 * While testing it exports object
 * and while running server or building server it exports function
 */
const Chess = typeof ChessJs === 'function' ? ChessJs : ChessJs.Chess;
const blackPlayerBoard = (squares, board) => {
  const newSquares = Array.from(squares);
  let newBoard = board.map(row => Array.from(row));
  newSquares.reverse();
  newBoard = newBoard.map(row => row.reverse()).reverse();
  return {
    newSquares,
    newBoard,
  };
};

const INIT_STATE = {
  board: [],
  playerColor: '',
  currentPlayer: WHITE_PLAYER,
  playerOneTime: DEFAULT_GAME_TIME_SECS,
  playerTwoTime: DEFAULT_GAME_TIME_SECS,
  isGameOver: false,
  gameOverMessage: '',
};

export default class ChessGame extends React.Component {
  playerOneIntervalId = null;

  playerTwoIntervalId = null;

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

  componentDidUpdate() {
    receiveMove((moveObj) => {
      this.chess.move(moveObj);
      this.updateBoardState();
    });
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  clearTimers = () => {
    clearInterval(this.playerOneIntervalId);
    clearInterval(this.playerTwoIntervalId);
  };

  endGame = (player = null) => {
    disconnect();
    this.clearTimers();
    const message = player === null ? 'Draw match!!' : `${player} has won!`;
    this.setState({ gameOverMessage: message, isGameOver: true });
  };

  handleGameOver = () => {
    if (this.chess.in_checkmate()) {
      const { currentPlayer } = this.state;
      this.endGame(currentPlayer);
    }
    const isDraw = this.chess.in_draw()
    || this.chess.in_stalemate()
    || this.chess.in_threefold_repetition();

    if (isDraw) {
      this.endGame(null);
    }
  };

  startPlayerTwoTimer = () => setInterval(() => {
    let { playerTwoTime } = this.state;
    playerTwoTime -= 1;
    this.setState({ playerTwoTime });
    if (playerTwoTime <= 0) {
      this.endGame(WHITE_PLAYER);
    }
  }, 1000);

  startPlayerOneTimer = () => setInterval(() => {
    let { playerOneTime } = this.state;
    playerOneTime -= 1;
    this.setState({ playerOneTime });
    if (playerOneTime <= 0) {
      this.endGame(BLACK_PLAYER);
    }
  }, 1000);

  flipTimer = () => {
    const { currentPlayer } = this.state;
    if (currentPlayer === WHITE_PLAYER) {
      clearInterval(this.playerOneIntervalId);
      this.playerTwoIntervalId = this.startPlayerTwoTimer();
    } else {
      clearInterval(this.playerTwoIntervalId);
      this.playerOneIntervalId = this.startPlayerOneTimer();
    }
  };

  startGame() {
    createConnection();
    this.chess = new Chess();
    this.squares = this.chess.SQUARES;
    const board = this.chess.board();

    const currentPlayer = this.chess.turn();
    receiveGameData(({ game }) => {
      let { playerColor } = this.state;
      if (!playerColor && !game.player2) {
        playerColor = game.player1.color;
      }
      if (!playerColor && game.player2) {
        playerColor = game.player2.color;
      }
      this.setState(Object.assign({}, INIT_STATE, { board, currentPlayer, playerColor }));
    });
  }

  movePiece(move) {
    this.chess.move(move);
    sendMove(move);
    this.updateBoardState();
    if (this.chess.history().length > 1) {
      this.flipTimer();
      if (this.chess.game_over()) {
        this.handleGameOver();
      }
    }
  }

  updateBoardState() {
    const board = this.chess.board();
    const currentPlayer = this.chess.turn();
    // eslint-disable-next-line react/no-unused-state
    this.setState({ board, currentPlayer });
  }

  calcPossibleMoves(param) {
    return this.chess.moves({ ...param, verbose: true });
  }

  render() {
    const {
      playerColor, isGameOver, gameOverMessage, playerOneTime, playerTwoTime,
    } = this.state;
    let { board } = this.state;
    let { squares } = this;
    if (playerColor === 'b') {
      const chessBoardData = blackPlayerBoard(squares, board);
      board = chessBoardData.newBoard;
      squares = chessBoardData.newSquares;
    }
    return (
      <>
        <div id="chess-game-container">
          <Timer time={playerTwoTime} />
          <ChessBoard
            calcPossibleMoves={this.calcPossibleMoves}
            movePiece={this.movePiece}
            squares={squares}
            board={board}
            playerColor={playerColor}
          />
          <Timer time={playerOneTime} />
          <div id="game-over-overlay" style={{ display: isGameOver ? 'block' : 'none' }}>
            <p>{gameOverMessage}</p>
            <button type="button" onClick={this.startGame}>
              Play Again
            </button>
          </div>
        </div>
      </>
    );
  }
}

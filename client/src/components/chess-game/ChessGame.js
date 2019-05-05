import React from 'react';
import ChessJs from 'chess.js';
import ChessBoard from '../chess-board/ChessBoard';
import GameOverOverlay from '../game-over-overlay/GameOverOverlay';
import Timer from '../timer/Timer';
import {
  BLACK_PLAYER, DEFAULT_GAME_TIME_SECS, WHITE_PLAYER, GAME_DRAW,
} from '../../config/chess-game';
import {
  createConnection, receiveGameData, sendMove, receiveMove, disconnect,
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

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const INIT_STATE = {
  board: [],
  playerColor: '',
  currentPlayer: WHITE_PLAYER,
  playerOneTime: DEFAULT_GAME_TIME_SECS,
  playerTwoTime: DEFAULT_GAME_TIME_SECS,
  isGameOver: false,
  playerOneRating: getRandomNumber(1400, 1500), // TODO: Change after login is implemented
  playerTwoRating: getRandomNumber(1400, 1500), // TODO: Change after login is implemented
  winner: '',
};

export default class ChessGame extends React.Component {
  playerOneIntervalId = null;

  playerTwoIntervalId = null;

  constructor(props) {
    super(props);
    this.state = Object.assign({}, INIT_STATE);
    this.chessBoardContainerRef = React.createRef();
  }

  componentDidMount() {
    const chessBoardContainerNode = this.chessBoardContainerRef.current;
    const {
      offsetWidth: chessBoardWidth, offsetHeight: chessBoardHeight,
    } = chessBoardContainerNode;
    this.setState({ chessBoardWidth, chessBoardHeight });
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
    disconnect();
  }

  clearTimers = () => {
    clearInterval(this.playerOneIntervalId);
    clearInterval(this.playerTwoIntervalId);
  };

  endGame = (player = GAME_DRAW) => {
    disconnect();
    this.clearTimers();
    this.setState({ isGameOver: true, winner: player });
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

  startGame = () => {
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

  movePiece = (move) => {
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

  updateBoardState = () => {
    const board = this.chess.board();
    const currentPlayer = this.chess.turn();
    this.setState({ board, currentPlayer });
  }

  calcPossibleMoves = param => this.chess.moves({ ...param, verbose: true })

  render() {
    const {
      playerColor, isGameOver, playerOneTime, playerTwoTime, playerOneRating,
      playerTwoRating, winner, chessBoardWidth, chessBoardHeight,
    } = this.state;
    let { board } = this.state;
    let { squares } = this;
    if (playerColor === BLACK_PLAYER) {
      const chessBoardData = blackPlayerBoard(squares, board);
      board = chessBoardData.newBoard;
      squares = chessBoardData.newSquares;
    }
    return (
      <>
        <Timer time={playerTwoTime} />
        <div id="chess-game-container">
          <ChessBoard
            chessBoardContainerRef={this.chessBoardContainerRef}
            calcPossibleMoves={this.calcPossibleMoves}
            movePiece={this.movePiece}
            squares={squares}
            board={board}
            playerColor={playerColor}
          />
          {isGameOver && (
            <GameOverOverlay
              playerOneRating={playerOneRating}
              playerTwoRating={playerTwoRating}
              winner={winner}
              startGame={this.startGame}
              width={chessBoardWidth}
              height={chessBoardHeight}
            />
          )}
        </div>
        <Timer time={playerOneTime} />
      </>
    );
  }
}

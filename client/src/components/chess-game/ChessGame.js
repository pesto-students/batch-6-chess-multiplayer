import React from 'react';
import ChessJs from 'chess.js';
import ChessBoard from '../chess-board/ChessBoard';
import GameOverOverlay from '../game-over-overlay/GameOverOverlay';
import Loader from '../ui/loader/Loader';
import Timer from '../timer/Timer';
import {
  BLACK_PLAYER, WHITE_PLAYER, GAME_DRAW,
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
  playerOneTime: 0,
  playerTwoTime: 0,
  isGameOver: false,
  playerOneRating: getRandomNumber(1400, 1500), // TODO: Change after login is implemented
  playerTwoRating: getRandomNumber(1400, 1500), // TODO: Change after login is implemented
  winner: '',
  gameReady: false,
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
    if (chessBoardContainerNode) {
      const {
        offsetWidth: chessBoardWidth, offsetHeight: chessBoardHeight,
      } = chessBoardContainerNode;
      this.setState({ chessBoardWidth, chessBoardHeight });
    }
    this.startGame();
    receiveMove(moveData => this.onMoveReceived(moveData));
  }

  componentWillUnmount() {
    this.clearTimers();
    disconnect();
  }


  onMoveReceived = ({ moveObj, time }) => {
    this.chess.move(moveObj);
    this.updateBoardState();
    const { playerColor } = this.state;
    const { playerOneTime: serverPlayerOne, playerTwoTime: serverPlayerTwo } = time;
    const playerOneTime = playerColor === WHITE_PLAYER ? serverPlayerOne : serverPlayerTwo;
    const playerTwoTime = playerColor === WHITE_PLAYER ? serverPlayerTwo : serverPlayerOne;
    this.setState({ playerOneTime, playerTwoTime });
    if (this.chess.game_over()) {
      this.handleGameOver();
    }
    this.resetTimers();
  }

  clearTimers = () => {
    clearInterval(this.playerOneIntervalId);
    clearInterval(this.playerTwoIntervalId);
  };

  endGame = (player = GAME_DRAW) => {
    this.clearTimers();
    disconnect();
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

  startPlayerTwoTimer = opponent => setInterval(() => {
    let { playerTwoTime } = this.state;
    playerTwoTime -= 1;
    this.setState({ playerTwoTime });
    if (playerTwoTime <= 0) {
      this.endGame(opponent);
    }
  }, 1000);

  startPlayerOneTimer = opponent => setInterval(() => {
    let { playerOneTime } = this.state;
    playerOneTime -= 1;
    this.setState({ playerOneTime });
    if (playerOneTime <= 0) {
      this.endGame(opponent);
    }
  }, 1000)

  resetTimers = () => {
    this.clearTimers();
    const { currentPlayer, playerColor } = this.state;
    if (currentPlayer === BLACK_PLAYER) {
      if (playerColor === BLACK_PLAYER) {
        this.playerOneIntervalId = this.startPlayerOneTimer(WHITE_PLAYER);
      } else {
        this.playerTwoIntervalId = this.startPlayerTwoTimer(WHITE_PLAYER);
      }
    } else if (currentPlayer === WHITE_PLAYER) {
      if (playerColor === WHITE_PLAYER) {
        this.playerOneIntervalId = this.startPlayerOneTimer(BLACK_PLAYER);
      } else {
        this.playerTwoIntervalId = this.startPlayerTwoTimer(BLACK_PLAYER);
      }
    }
  };

  startGame = () => {
    createConnection();
    this.chess = new Chess();
    this.squares = this.chess.SQUARES;
    const board = this.chess.board();

    const currentPlayer = this.chess.turn();
    receiveGameData(({ game, time }) => {
      let { playerColor, gameReady } = this.state;
      if (!playerColor && !game.player2) {
        playerColor = game.player1.color;
      }
      if (!playerColor && game.player2) {
        playerColor = game.player2.color;
      }
      if (game.player1 && game.player2) {
        gameReady = true;
      }
      const { playerOneTime, playerTwoTime } = time;
      this.setState(Object.assign({}, INIT_STATE, {
        board, currentPlayer, playerColor, gameReady, playerOneTime, playerTwoTime,
      }));
    });
  }

  movePiece = (move) => {
    this.clearTimers();
    const restoreBoard = ({ validMove, playerColor }) => {
      if (!validMove) {
        this.setState({ playerColor });
      }
    };
    sendMove(move, restoreBoard);
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
      playerTwoRating, winner, chessBoardWidth, chessBoardHeight, gameReady,
    } = this.state;
    let { board } = this.state;
    let { squares } = this;
    if (playerColor === BLACK_PLAYER) {
      const chessBoardData = blackPlayerBoard(squares, board);
      board = chessBoardData.newBoard;
      squares = chessBoardData.newSquares;
    }

    if (!gameReady) {
      return <Loader height={100} width={100} />;
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

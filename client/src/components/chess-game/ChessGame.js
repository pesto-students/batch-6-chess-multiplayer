import React from 'react';
import ChessJs from 'chess.js';
import { Prompt } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ChessBoard from '../chess-board/ChessBoard';
import GameOverOverlay from '../game-over-overlay/GameOverOverlay';
import Loader from '../ui/loader/Loader';
import Timer from '../timer/Timer';
import MoveHistory from '../move-history/MoveHistory';
import {
  BLACK_PLAYER, WHITE_PLAYER, GAME_DRAW,
} from '../../config/chess-game';
import {
  createConnection, receiveGameData, sendMove, receiveMove, disconnect, opponentDisconnected,
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
  playerOneTime: 0,
  playerTwoTime: 0,
  isGameOver: false,
  playerOneInfo: {
    name: null,
    rating: 0,
  },
  playerTwoInfo: {
    name: null,
    rating: 0,
  },
  winner: '',
  gameReady: false,
  isBlocking: true,
  lastMove: {},
  moves: [],
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
    this.startGame();
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
    const newHistory = this.chess.history({ verbose: true });
    this.setState({
      playerOneTime, playerTwoTime, lastMove: moveObj, moves: [...newHistory],
    });
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
    this.updateBoardDimensions();
    this.setState({ isGameOver: true, winner: player, isBlocking: false });
  };

  updateBoardDimensions = () => {
    const chessBoardContainerNode = this.chessBoardContainerRef.current;
    if (chessBoardContainerNode) {
      const {
        offsetWidth: chessBoardWidth, offsetHeight: chessBoardHeight,
      } = chessBoardContainerNode;
      this.setState({ chessBoardWidth, chessBoardHeight });
    }
  }

  handleGameOver = () => {
    if (this.chess.in_checkmate()) {
      const { currentPlayer } = this.state;
      this.endGame(currentPlayer);
    }
    const isDraw = this.chess.in_draw()
    || this.chess.in_stalemate()
    || this.chess.in_threefold_repetition();

    if (isDraw) {
      this.endGame(GAME_DRAW);
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
    this.setState(Object.assign({}, INIT_STATE));
    receiveMove(moveData => this.onMoveReceived(moveData));
    receiveGameData(({ game, time }) => {
      let {
        playerColor, playerOneInfo, playerTwoInfo, gameReady,
      } = this.state;
      if (!playerColor && !game.player2) {
        playerColor = game.player1.color;
      }
      if (!playerColor && game.player2) {
        playerColor = game.player2.color;
      }
      if (game.player1 && game.player2) {
        playerOneInfo = playerColor === WHITE_PLAYER ? game.player1.user : game.player2.user;
        playerTwoInfo = playerColor === WHITE_PLAYER ? game.player2.user : game.player1.user;
        gameReady = true;
      }
      const { playerOneTime, playerTwoTime } = time;
      this.setState(Object.assign({}, INIT_STATE, {
        board,
        currentPlayer,
        playerColor,
        gameReady,
        playerOneTime,
        playerTwoTime,
        playerOneInfo,
        playerTwoInfo,
      }));
    });
    opponentDisconnected(() => {
      const { playerColor } = this.state;
      this.endGame(playerColor);
      disconnect();
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
      playerColor, isGameOver, playerOneTime, playerTwoTime, playerOneInfo, currentPlayer,
      playerTwoInfo, winner, chessBoardWidth, chessBoardHeight, gameReady, isBlocking,
      lastMove, moves,
    } = this.state;
    let { board } = this.state;
    let { squares } = this;
    if (playerColor === BLACK_PLAYER) {
      const chessBoardData = blackPlayerBoard(squares, board);
      board = chessBoardData.newBoard;
      squares = chessBoardData.newSquares;
    }
    const isPlayerOneTurn = currentPlayer === playerColor;
    const isPlayerTwoTurn = currentPlayer !== playerColor;

    if (!gameReady) {
      return <Loader height={100} width={100} />;
    }

    const PlayerInfo = ({ name, rating }) => (
      <div className="player-detail">
        <div className="player-name">{name}</div>
        <div className="player-rating">{rating}</div>
      </div>
    );

    return (
      <div className="chess-game-container">
        <Prompt
          when={isBlocking}
          message={() => 'Are you sure you want to leave this page?\n\nPlease note you will lose the game if you leave!'
          }
        />
        <div>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12} md={6}>
              <div id="chess-board-container" ref={this.chessBoardContainerRef}>
                <div className="top-player">
                  {PlayerInfo(playerTwoInfo)}
                  <Timer time={playerTwoTime} isActive={isPlayerTwoTurn} classes="player-time" />
                </div>
                <ChessBoard
                  calcPossibleMoves={this.calcPossibleMoves}
                  movePiece={this.movePiece}
                  squares={squares}
                  board={board}
                  playerColor={playerColor}
                  prevMove={lastMove}
                />
                {isGameOver && (
                <GameOverOverlay
                  playerOneRating={playerOneInfo.rating}
                  playerTwoRating={playerTwoInfo.rating}
                  winner={winner}
                  width={chessBoardWidth}
                  startGame={this.startGame}
                  height={chessBoardHeight}
                />
                )}
                <div className="bottom-player">
                  {PlayerInfo(playerOneInfo)}
                  <Timer time={playerOneTime} isActive={isPlayerOneTurn} classes="player-time" />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <MoveHistory moves={moves} />
            </Grid>
          </Grid>

        </div>

      </div>
    );
  }
}

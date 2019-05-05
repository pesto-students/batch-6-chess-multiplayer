import CGUtil from './chess-game-util';
import Config from '../config/config';

const { chessGame } = Config;
describe('Test Chess game Util', () => {
  it('Should return new rating if players win or match is draw', () => {
    const playerOneRating = 1356;
    const playerTwoRating = 3462;
    expect(CGUtil.calcRating(playerOneRating, playerTwoRating, chessGame.WHITE_PLAYER))
      .not.toBe({ playerOneNewRating: playerOneRating, playerTwoNewRating: playerTwoRating });

    expect(CGUtil.calcRating(playerOneRating, playerTwoRating, chessGame.BLACK_PLAYER))
      .not.toBe({ playerOneNewRating: playerOneRating, playerTwoNewRating: playerTwoRating });

    expect(CGUtil.calcRating(playerOneRating, playerTwoRating, chessGame.GAME_DRAW))
      .not.toBe({ playerOneNewRating: playerOneRating, playerTwoNewRating: playerTwoRating });
  });

  it('Should calculate rating, according Elo rating system', () => {
    const playerOneRating = 1445;
    const playerTwoRating = 1564;
    expect(CGUtil.calcRating(playerOneRating, playerTwoRating, chessGame.WHITE_PLAYER))
      .toEqual({ playerOneNewRating: 1466, playerTwoNewRating: 1543 });

    expect(CGUtil.calcRating(playerOneRating, playerTwoRating, chessGame.BLACK_PLAYER))
      .toEqual({ playerOneNewRating: 1434, playerTwoNewRating: 1575 });

    expect(CGUtil.calcRating(playerOneRating, playerTwoRating, chessGame.GAME_DRAW))
      .toEqual({ playerOneNewRating: 1450, playerTwoNewRating: 1559 });
  });

  it('Should return same rating for invalid winner', () => {
    const playerOneRating = 1356;
    const playerTwoRating = 3462;
    expect(CGUtil.calcRating(playerOneRating, playerTwoRating, 'random'))
      .toEqual({ playerOneNewRating: playerOneRating, playerTwoNewRating: playerTwoRating });
  });
});

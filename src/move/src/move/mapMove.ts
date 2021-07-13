import { queries } from './db';
import { TicTacToeGame } from '@ttt/lib/TicTacToeGame';
import { RequestBody } from './requestBody';

const createPoint = (x: number, y: number) => {
  return { x: x, y: y };
};

const mapDbMoveToMove = (move: queries.Move) => {
  return {
    boardPosition: createPoint(move.board_x, move.board_y),
    tilePosition: createPoint(move.tile_x, move.tile_y),
  };
};

const mapDbMovesToMoves = (moves: readonly queries.Move[]) => {
  return moves.map(mapDbMoveToMove);
};

// Readonly needs to be applied as the array from the db is returned as readonly
export const initGame = (moves: readonly queries.Move[]) => {
  const mapped = mapDbMovesToMoves(moves);
  return new TicTacToeGame(mapped);
};

export const mapRequestMoveToMove = (move: RequestBody) => {
  return {
    boardPosition: createPoint(move.boardX, move.boardY),
    tilePosition: createPoint(move.tileX, move.tileY),
  };
};

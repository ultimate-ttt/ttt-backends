import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createPool } from 'slonik';
import { connectionString } from '../environment';
import { Status } from '@ttt/lib/Status';
import { validBody } from './validateRequest';
import { RequestBody } from './requestBody';
import {
  createMove,
  getMoves,
  getPlayerOneId,
  getPlayerTwoId,
  updateGameState,
} from './db';
import { GameState } from '@ttt/lib/db/GameState';
import { initGame, mapRequestMoveToMove } from './mapMove';
import { Player } from '@ttt/lib/TicTacToeGame';

interface CustomContext extends Context {
  res: {
    status?: number;
    body?: {
      message?: string
    };
  };
}

interface CustomRequest extends HttpRequest {
  body?: RequestBody;
}

const badRequest = (message: string) => {
  return {
    status: Status.BadRequest,
    body: {
      message: message,
    },
  };
};

const pool = createPool(connectionString);

const httpTrigger: AzureFunction = async function (
  context: CustomContext,
  req: CustomRequest,
): Promise<void> {
  if (!validBody(req.body)) {
    context.res = badRequest('Request Body is formally invalid');
    return;
  }

  const move = req.body;
  const moves = await pool.connect((con) => getMoves(con, move.gameId));
  const tttGame = initGame(moves);

  const currentPlayer = tttGame.getCurrentPlayer();
  let playerId = '';
  if (currentPlayer === Player.Cross) {
    playerId = await pool.connect((con) => getPlayerOneId(con, move.gameId));
  } else {
    playerId = await pool.connect((con) => getPlayerTwoId(con, move.gameId));
  }

  if (playerId !== move.playerId) {
    context.res = badRequest('Player Id is not correct');
    return;
  }

  const gameMove = mapRequestMoveToMove(move);
  const validMove = tttGame.validMove(gameMove);
  if (!validMove) {
    context.res = badRequest('Move is invalid');
    return;
  }

  context.log('try to update game state');
  if (tttGame.getMoves().length === 0) {
    await pool.connect((con) =>
      updateGameState(con, move.gameId, GameState.InProgress),
    );
  }

  tttGame.applyMove(gameMove);
  if (tttGame.getWinResult().isFinished) {
    await pool.connect((con) =>
      updateGameState(con, move.gameId, GameState.Finished),
    );
  }

  await pool.connect((con) => createMove(con, move));

  context.res = {};
};

export default httpTrigger;

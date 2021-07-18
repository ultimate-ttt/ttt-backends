import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createPool } from 'slonik';
import environment from '../environment';
import { Status } from '@ttt/lib/Status';
import { validBody } from './validateRequest';
import { RequestBody } from './requestBody';
import {
  createMove, getGameState,
  getMoves,
  getPlayerOneId,
  getPlayerTwoId,
  updateGameState,
} from './db';
import { GameState } from '@ttt/lib/GameState';
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

const pool = createPool(environment.connectionString);

const httpTrigger: AzureFunction = async function(
  context: CustomContext,
  req: CustomRequest,
): Promise<void> {
  if (!validBody(req.body)) {
    context.res = badRequest('Request Body is formally invalid');
    return;
  }
  const move = req.body;

  const gameState = await pool.connect(con => getGameState(con, move.gameId));
  if (gameState && gameState < GameState.Connected) {
    context.res = badRequest('Game needs to be started');
    return;
  }

  const moves = await pool.connect((con) => getMoves(con, move.gameId));
  const tttGame = initGame(moves);

  const currentPlayer = tttGame.getCurrentPlayer();
  let playerId;
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

  await pool.connect((con) => createMove(con, move, currentPlayer));

  context.res = {};
};

export default httpTrigger;

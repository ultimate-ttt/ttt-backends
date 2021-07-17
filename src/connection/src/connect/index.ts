import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createPool } from 'slonik';
import { connectionString } from '../environment';
import { Status } from '@ttt/lib/Status';
import { RequestBody, validBody } from './validateRequest';
import { getPlayerTwoId, updateGameState } from '../db';
import { GameState } from '@ttt/lib/db/GameState';

interface CustomContext extends Context {
  res: {
    status?: number;
    body?: {
      playerId?: string;
      message?: string;
    };
  };
}

interface CustomRequest extends HttpRequest {
  body?: RequestBody;
}

const pool = createPool(connectionString);

const httpTrigger: AzureFunction = async function(
  context: CustomContext,
  req: CustomRequest,
): Promise<void> {
  if (!validBody(req.body)) {
    context.res = {
      status: Status.BadRequest,
      body: {
        message: 'Request Body is formally invalid',
      },
    };
    return;
  }

  const shortId = req.body.shortId;
  const playerInfo = await pool.connect(con => getPlayerTwoId(con, shortId));

  if (playerInfo === null) {
    context.res = {
      status: Status.BadRequest,
      body: {
        message: 'Game does not exist',
      },
    };
    return;
  }

  if (playerInfo.fk_game_state_id > GameState.Created) {
    context.res = {
      status: Status.Forbidden,
    };
    return;
  }

  await pool.connect(con => updateGameState(con, shortId, GameState.Connected));

  context.res = {
    body: {
      playerId: playerInfo.player_two_id,
    },
  };
};

export default httpTrigger;
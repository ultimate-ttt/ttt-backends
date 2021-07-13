import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createPool } from 'slonik';
import { connectionString } from '../environment';
import { Status } from '@ttt/lib/Status';
import { RequestBody, validBody } from './validateRequest';
import { getPlayerTwoId } from '../db';

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

const httpTrigger: AzureFunction = async function (
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
  const playerId = await pool.connect(con => getPlayerTwoId(con, shortId));

  if (playerId === null) {
    context.res = {
      status: Status.BadRequest,
    };
    return;
  }

  context.res = {
    body: {
      playerId: playerId.player_two_id,
    },
  };
};

export default httpTrigger;
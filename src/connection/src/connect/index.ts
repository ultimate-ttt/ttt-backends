import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createPool, sql } from 'slonik';
import { connectionString } from '../environment';
import { Status } from '@ttt/lib/Status';
import { RequestBody, validBody } from './validateRequest';

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
  const playerId = await pool.connect((connection) => {
    return connection.maybeOne(
      sql<queries.Game>`select player_two_id from games where short_id = ${shortId}`,
    );
  });

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

declare namespace queries {
  // Generated by @slonik/typegen

  /** - query: `select player_two_id from games where short_id = $1` */
  export interface Game {
    /** regtype: `uuid` */
    player_two_id: string;
  }
}

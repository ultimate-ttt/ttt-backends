import { AzureFunction, Context } from '@azure/functions';
import { createPool, sql } from 'slonik';
import { GameState } from '@ttt/lib/db/GameState';
import ShortUniqueId from 'short-unique-id';
import { connectionString } from '../environment';
import { createGame } from '../db';

interface CustomContext extends Context {
  res: {
    status?: number;
    body: {
      shortId: string;
      playerId: string;
    };
  };
}

const pool = createPool(connectionString);

const httpTrigger: AzureFunction = async function (
  context: CustomContext,
): Promise<void> {
  const shortId = new ShortUniqueId().randomUUID();
  const playerOneId = await pool.connect(con => createGame(con, shortId, GameState.Created));

  context.res = {
    body: {
      shortId: shortId,
      playerId: playerOneId,
    },
  };
};

export default httpTrigger;

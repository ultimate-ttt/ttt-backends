import { AzureFunction, Context } from '@azure/functions';
import { createPool } from 'slonik';
import { GameState } from '@ttt/lib/GameState';
import ShortUniqueId from 'short-unique-id';
import { createGame } from '../db';
import environment from '../environment';

interface CustomContext extends Context {
  res: {
    status?: number;
    body: {
      shortId: string;
      playerId: string;
    };
  };
}

const pool = createPool(environment.connectionString);

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

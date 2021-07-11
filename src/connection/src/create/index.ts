import { AzureFunction, Context } from "@azure/functions";
import { createPool, sql } from "slonik";
import { GameState } from "@ttt/lib";
import * as crypto from "crypto";
import ShortUniqueId from "short-unique-id";
import { connectionString } from '../environment';

interface FunctionContext extends Context {
  res: {
    status?: number;
    body?: {
      shortId: string;
      playerId: string;
    };
  };
}

const httpTrigger: AzureFunction = async function (
  context: FunctionContext
): Promise<void> {
  context.log(connectionString);
  const pool = createPool(connectionString);

  const game = {
    shortId: new ShortUniqueId().randomUUID(),
    gameState: GameState.Created,
    playerOneId: crypto.randomUUID(),
    playerTwoId: crypto.randomUUID(),
  };

  await pool.connect((connection) => {
    return connection.query(sql<queries._void>`
        insert into games (short_id, player_one_id, player_two_id, fk_game_state_id, fk_winner_id)
        values (${game.shortId}, ${game.playerOneId}, ${game.playerTwoId}, ${game.gameState}, null)`);
  });

  context.res = {
    body: {
      shortId: game.shortId,
      playerId: game.playerOneId,
    },
  };
};

export default httpTrigger;

export declare namespace queries {
  // Generated by @slonik/typegen

  /** - query: `insert into games (short_id, player_one_... [truncated] ...winner_id) values ($1, $2, $3, $4, null)` */
  export type _void = {};
}
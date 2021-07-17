import { notUndefined } from '@ttt/lib/Validators';
import { RequestBody } from './requestBody';

const validCoordinate = (board: number) => board >= 0 && board <= 2;

const validShortId = (id: string) => id.length === 6;

const validPlayerId = (id: string) => id.length === 36;

export const validBody = (body: RequestBody) => {
  return (
    notUndefined(body) &&
    notUndefined(body.gameId) &&
    validShortId(body.gameId) &&
    notUndefined(body.playerId) &&
    validPlayerId(body.playerId) &&
    notUndefined(body.boardX) &&
    notUndefined(body.boardY) &&
    notUndefined(body.tileX) &&
    notUndefined(body.tileY) &&
    validCoordinate(body.boardX) &&
    validCoordinate(body.boardY) &&
    validCoordinate(body.tileX) &&
    validCoordinate(body.tileY)
  );
};

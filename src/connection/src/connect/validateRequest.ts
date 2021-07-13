import { notUndefined } from '@ttt/lib/Validators';

export interface RequestBody {
  shortId?: string;
}

export const validBody = (body: RequestBody) => {
  return notUndefined(body) && notUndefined(body) && body.shortId.length === 6;
};

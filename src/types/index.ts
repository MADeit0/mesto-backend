import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/user';
import { ICard } from '../models/card';

export interface UserRequest extends Request<{userId: string}, {}, IUser, {}> {
  user?: JwtPayload & {_id?: string}
}

export interface CardRequest extends Request<{cardId: string}, {}, ICard, {}> {
  user?: JwtPayload & {_id?: string}
}

import { Request } from 'express';

export interface DataStoredInToken {
  id: number;
  name:string;
  email: string;
}

export interface TokenData {
  token: string;
}

export interface RequestWithUser extends Request {
  user: DataStoredInToken;
}

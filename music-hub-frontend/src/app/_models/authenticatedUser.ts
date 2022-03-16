import {User} from './user';

export interface AuthenticatedUser {
  user: User;
  token: string;
}

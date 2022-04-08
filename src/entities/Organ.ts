import { User } from './User';

export interface Organ {
  organUser: User;
  organMembers: User[];
  organName: string;
}

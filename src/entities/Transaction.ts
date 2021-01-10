import { User } from '@/entities/User';
import { BaseEntity } from '@/entities/BaseEntity';
import { SubTransaction } from './SubTransaction';

export interface Transaction extends BaseEntity {
  id?: number;
  from: User;
  createdBy: User;

  subTransactions: SubTransaction[];
}

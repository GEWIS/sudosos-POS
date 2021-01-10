import { User } from '@/entities/User';
import { Container } from '@/entities/Container';
import { BaseEntity } from '@/entities/BaseEntity';
import { SubTransactionRow } from './SubTransactionRow';

export interface SubTransaction extends BaseEntity {
  id?: number;
  to: User;
  container: Container;
  subTransactionRows: SubTransactionRow[];
}

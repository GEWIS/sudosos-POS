import { Product } from '@/entities/Product';
import { BaseEntity } from '@/entities/BaseEntity';

export interface SubTransactionRow extends BaseEntity {
  id?: number;
  product: Product;
  amount: number;
  price: number;
}

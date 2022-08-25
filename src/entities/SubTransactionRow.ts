import { Dinero } from 'dinero.js';
import { Product } from '@/entities/Product';
import { BaseEntity } from '@/entities/BaseEntity';

export interface SubTransactionRow extends BaseEntity {
  product: Product;
  amount: number;
  priceInclVat: Dinero;
  totalPriceInclVat?: {
    amount: number,
    precision: number,
    currency: string,
  },
}

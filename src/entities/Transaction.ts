import { BaseUser, User } from '@/entities/User';
import { BaseEntity } from '@/entities/BaseEntity';
import { BasePointOfSale, PointOfSale } from '@/entities/PointOfSale';
import { SubTransaction } from '@/entities/SubTransaction';
import { Dinero } from 'dinero.js';

export interface Transaction extends BaseEntity {
  from: BaseUser | User;
  createdBy?: BaseUser | User;
  pointOfSale: BasePointOfSale | PointOfSale;
  subTransactions: SubTransaction[];
  priceInclVat: Dinero;
}

export interface POSTransaction {
  id: number;
  transactions: Transaction[];
}

export interface TransactionFilter {
  fromId: number,
  createdById: number,
  toId: number,
  pointOfSaleId: number,
  productId: number,
  productRevision: number,
  fromDate: string,
  tillDate: string,
}

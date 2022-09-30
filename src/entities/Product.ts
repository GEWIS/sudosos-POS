import { Dinero } from 'dinero.js';
import { BaseUser, User } from '@/entities/User';
import { ProductCategory } from '@/entities/ProductCategory';
import { BaseEntity } from '@/entities/BaseEntity';
import { BaseVatGroup } from '@/entities/VatGroup';

export interface BaseProduct extends BaseEntity {
  name: string;
  nameWithoutAccents: string;
  vat: BaseVatGroup;
  priceInclVat: Dinero;
}

export interface Product extends BaseProduct {
  revision?: number;
  owner: BaseUser | User;
  category: ProductCategory;
  picture: string;
  alcoholPercentage: number;
  updatePending?: boolean;
}

export interface ProductInContainer extends Product {
  containerId?: number;
}

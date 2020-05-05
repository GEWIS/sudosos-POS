import { Product } from '@/entities/Product';

export interface ProductCategory {
  id: String;
  name: String;
  products: Product[];
}

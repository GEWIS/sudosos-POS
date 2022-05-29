import Dinero from 'dinero.js';
import { BaseProduct, Product } from '@/entities/Product';
import { ProductOrder } from '@/entities/ProductOrder';
import UserTransformer from '@/transformers/UserTransformer';
import BaseTransformer from '@/transformers/BaseTransformer';
import ProductCategoryTransformer from '@/transformers/ProductCategoryTransformer';

export default {
  makeProduct(data: any) : BaseProduct | Product {
    const price = data.priceInclVat;

    if (!Object.keys(data).includes('owner')) {
      return {
        ...BaseTransformer.makeBaseEntity(data),
        name: data.name,
        price,
      } as BaseProduct;
    }

    return {
      ...BaseTransformer.makeBaseEntity(data),
      revision: data.revision,
      name: data.name,
      price,
      vat: data.vat.percentage,
      owner: UserTransformer.makeUser(data.owner),
      category: ProductCategoryTransformer.makeProductCategory(data.category),
      picture: data.image,
      alcoholPercentage: data.alcoholPercentage,
      updatePending: data.updatePending,
    } as Product;
  },

  makeProductOrder(data: any): ProductOrder {
    return {
      productID: data.productID,
      order: data.order,
    } as ProductOrder;
  },
};

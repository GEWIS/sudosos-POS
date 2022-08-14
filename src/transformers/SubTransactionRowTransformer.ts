import Dinero from 'dinero.js';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import ProductTransformer from '@/transformers/ProductTransformer';
import BaseTransformer from '@/transformers/BaseTransformer';

export default {
  makeSubTransactionRow(data: any) {
    const product = ProductTransformer.makeProduct(data.product);
    let priceInclVat;

    if (typeof data.totalPriceInclVat === 'object') {
      // This is to satisfy ESLint, yay
      priceInclVat = Dinero(data.totalPriceInclVat);
    } else {
      priceInclVat = Dinero({ amount: Number(product.priceInclVat.getAmount() * data.amount), currency: 'EUR' });
    }

    return {
      ...BaseTransformer.makeBaseEntity(data),
      product,
      amount: data.amount,
      priceInclVat,
    } as SubTransactionRow;
  },
};

/* eslint-disable max-len */
import Dinero from 'dinero.js';
import { Transaction } from '@/entities/Transaction';
import UserTransformer from '@/transformers/UserTransformer';
import PointOfSaleTransformer from '@/transformers/PointOfSaleTransformer';
import SubTransactionTransformer from '@/transformers/SubTransactionTransformer';
import BaseTransformer from '@/transformers/BaseTransformer';
import { SubTransaction } from '@/entities/SubTransaction';

export default {
  makeTransaction(data: any) : Transaction {
    const subTransactions = data.subTransactions ? data.subTransactions.map((subTrans: any) => SubTransactionTransformer.makeSubTransaction(subTrans)) : undefined;
    let priceInclVat: Dinero.Dinero;

    if (typeof data.totalPriceInclVat === 'object') {
      // This is to satisfy ESLint, yay
      priceInclVat = Dinero(data.totalPriceInclVat);
    } else if (typeof data.value === 'object') {
      priceInclVat = Dinero(data.value);
    } else if (subTransactions !== undefined) {
      let tempPrice = 0;
      subTransactions.forEach((subTrans: SubTransaction) => { tempPrice += subTrans.priceInclVat.getAmount(); });
      priceInclVat = Dinero({ amount: Number(tempPrice), currency: 'EUR' });
    }

    return {
      ...BaseTransformer.makeBaseEntity(data),
      from: UserTransformer.makeUser(data.from),
      createdBy: UserTransformer.makeUser(data.createdBy),
      pointOfSale: PointOfSaleTransformer.makePointOfSale(data.pointOfSale),
      subTransactions,
      priceInclVat,
    } as Transaction;
  },
};

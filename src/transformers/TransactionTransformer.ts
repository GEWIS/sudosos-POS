/* eslint-disable max-len */
import Dinero from 'dinero.js';
import { Transaction } from '@/entities/Transaction';
import UserTransformer from '@/transformers/UserTransformer';
import PointOfSaleTransformer from '@/transformers/PointOfSaleTransformer';
import SubTransactionTransformer from '@/transformers/SubTransactionTransformer';
import BaseTransformer from '@/transformers/BaseTransformer';
import { SubTransaction } from '@/entities/SubTransaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';

export default {
  makeTransaction(data: any) : Transaction {
    const subTransactions = data.subTransactions ? data.subTransactions.map((subTrans: any) => SubTransactionTransformer.makeSubTransaction(subTrans)) : undefined;
    let price: Dinero.Dinero;

    if (typeof data.totalPriceInclVat === 'object') {
      // This is to satisfy ESLint, yay
      const dineroPrice = data.totalPriceInclVat;
      price = Dinero(dineroPrice);
    } else if (typeof data.value === 'object') {
      price = Dinero(data.value);
    } else if (subTransactions !== undefined) {
      let tempPrice = 0;
      subTransactions.forEach((subTrans: SubTransaction) => { tempPrice += subTrans.price.getAmount(); });
      price = Dinero({ amount: Number(tempPrice), currency: 'EUR' });
    }

    return {
      ...BaseTransformer.makeBaseEntity(data),
      from: UserTransformer.makeUser(data.from),
      createdBy: UserTransformer.makeUser(data.createdBy),
      pointOfSale: PointOfSaleTransformer.makePointOfSale(data.pointOfSale),
      subTransactions,
      price,
    } as Transaction;
  },
};

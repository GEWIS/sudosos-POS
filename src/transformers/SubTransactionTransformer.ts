/* eslint-disable max-len */

import Dinero from 'dinero.js';
import { SubTransaction } from '@/entities/SubTransaction';
import UserTransformer from '@/transformers/UserTransformer';
import ContainerTransformer from '@/transformers/ContainerTransformer';
import SubTransactionRowTransformer from '@/transformers/SubTransactionRowTransformer';
import BaseTransformer from '@/transformers/BaseTransformer';
import { SubTransactionRow } from '@/entities/SubTransactionRow';

export default {
  makeSubTransaction(data: any) : SubTransaction {
    const subTransactionRows = data.subTransactionRows.map((subTransRow: any) => SubTransactionRowTransformer.makeSubTransactionRow(subTransRow));
    let priceInclVat;

    if (typeof data.totalPriceInclVat === 'object') {
      // This is to satisfy ESLint, yay
      priceInclVat = Dinero(data.totalPriceInclVat);
    } else {
      let tempPrice = 0;
      subTransactionRows.forEach((subTransRow: SubTransactionRow) => { tempPrice += (subTransRow.priceInclVat as any).amount; });
      priceInclVat = Dinero({ amount: Number(tempPrice), currency: 'EUR' });
    }

    return {
      ...BaseTransformer.makeBaseEntity(data),
      to: UserTransformer.makeUser(data.to),
      container: ContainerTransformer.makeContainer(data.container),
      subTransactionRows,
      priceInclVat,
    } as SubTransaction;
  },
};

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
    let price;

    if (typeof data.totalPriceInclVat === 'object') {
      // This is to satisfy ESLint, yay
      const dineroPrice = data.totalPriceInclVat;
      price = dineroPrice;
    } else {
      let tempPrice = 0;
      subTransactionRows.forEach((subTransRow: SubTransactionRow) => { tempPrice += (subTransRow.price as any).amount; });
      price = Dinero({ amount: Number(tempPrice), currency: 'EUR' });
    }

    return {
      ...BaseTransformer.makeBaseEntity(data),
      to: UserTransformer.makeUser(data.to),
      container: ContainerTransformer.makeContainer(data.container),
      subTransactionRows,
      price,
    } as SubTransaction;
  },
};

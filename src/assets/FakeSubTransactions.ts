import { SubTransaction } from '@/entities/SubTransaction';

export default class FakeSubTransactions {
  public static fetchSubTransactions(): SubTransaction[] {
    const subTransactions = [
      {
        transactionId: '001',
        productId: '1',
        storageId: '1',
        amount: 4,
        pricePerProduct: 110,
      } as SubTransaction,
      {
        transactionId: '001',
        productId: '2',
        storageId: '1',
        amount: 2,
        pricePerProduct: 90,
      } as SubTransaction,
      {

        transactionId: '001',
        productId: '3',
        storageId: '2',
        amount: 1,
        pricePerProduct: 50,
      } as SubTransaction,
      {
        transactionId: '001',
        productId: '2',
        storageId: '1',
        amount: 2,
        pricePerProduct: 90,
      } as SubTransaction,
    ] as SubTransaction[];

    return subTransactions;
  }
}

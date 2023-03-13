import APIHelper from '@/mixins/APIHelper';
import TransactionTransformer from '@/transformers/TransactionTransformer';
import PaginationTransformer from '@/transformers/PaginationTransformer';
import { Transaction, TransactionFilter } from '@/entities/Transaction';
import { Paginated } from '@/entities/Pagination';

/**
 * Get all the transactions using the `transactions` endpoint, as a paginated response, and with
 * a given filter.
 * @param {Partial<TransactionFilter>} filter The filter to apply to the transactions.
 * @param {Number} take The number of records to take, this can be null.
 * @param {Number} skip The number of records to skip, this can be null.
 * @returns {Promise<Paginated<Transaction>>} A promise that resolves to a paginated response.
 * @see TransactionFilter
 */
export async function getTransactions(
  filter: Partial<TransactionFilter>,
  take: number | null = null, skip: number | null = null,
): Promise<Paginated<Transaction>> {
  const body = {
    ...filter,
    ...take && { take },
    ...skip && { skip },
  };

  const response = await APIHelper.getResource('transactions', body);
  const _pagination = PaginationTransformer.makePagination(response._pagination);
  const records = response.records.map(
    (transaction: any) => TransactionTransformer.makeTransaction(transaction),
  );

  return { _pagination, records } as Paginated<Transaction>;
}

/**
 * Update the given transaction using the `transactions` endpoint.
 * @param {any} transaction The transaction to update.
 * @returns {Promise<Transaction>} A promise that resolves to the updated transaction.
 */
export async function postTransaction(transaction: any): Promise<Transaction> {
  const response = await APIHelper.postResource('transactions', transaction);

  return TransactionTransformer.makeTransaction(response);
}

/**
 * Get the transaction at the given id using the `transactions/${id}` endpoint.
 * @param {Number} id The id of the transaction.
 * @returns {Promise<Transaction>} A promise that resolves to a transaction.
 */
export async function getTransaction(id: number): Promise<Transaction> {
  const response = await APIHelper.getResource(`transactions/${id}`);

  return TransactionTransformer.makeTransaction(response);
}

/**
 * Get the transactions of the given user id using the
 * `users/${id}/transactions` endpoint, as a paginated response, and with a
 * given filter.
 * @param {Number} id The id of the user.
 * @param {Partial<TransactionFilter>} filter The filter to apply to the
 * transactions.
 * @param {Number} take The number of records to take, this can be null.
 * @param {Number} skip The number of records to skip, this can be null.
 * @returns {Promise<Paginated<Transaction>>} A promise that resolves to a
 * paginated response.
 */
export async function getUserTransactions(
  id: number, filter: Partial<TransactionFilter>,
  take: number | null = null, skip: number | null = null,
): Promise<Paginated<Transaction>> {
  const body = {
    ...filter,
    ...take && { take },
    ...skip && { skip },
  };

  const response = await APIHelper.getResource(`users/${id}/transactions`, body);
  const _pagination = PaginationTransformer.makePagination(response._pagination);
  const records = response.records.map(
    (transaction: any) => TransactionTransformer.makeTransaction(transaction),
  );

  return { _pagination, records } as Paginated<Transaction>;
}

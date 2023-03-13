import APIHelper from '@/mixins/APIHelper';
import UserTransformer from '@/transformers/UserTransformer';
import { Dinero } from 'dinero.js';

/**
 * Get the balance of the given user id using the `balances/${id}` endpoint.
 * @param {Number} id The id of the user.
 * @returns {Promise<Dinero>} A promise that resolves to a Dinero object.
 */
export default async function getUserBalance(id: Number): Promise<Dinero> {
  const response = await APIHelper.getResource(`balances/${id}`);

  return UserTransformer.makeSaldo(response);
}

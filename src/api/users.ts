import UserTransformer from '@/transformers/UserTransformer';
import PaginationTransformer from '@/transformers/PaginationTransformer';
import APIHelper from '@/mixins/APIHelper';
import { User } from '@/entities/User';
import { Paginated } from '@/entities/Pagination';

/**
 * Get all the users using the `users` endpoint, as a paginated response.
 * @param {Number} take The number of records to take, this can be null.
 * @param {Number} skip The number of records to skip, this can be null.
 * @returns {Promise<Paginated<User>>} A promise that resolves to a paginated
 * response.
 */
export async function getUsers(
  take: number | null = null,
  skip: number | null = null,
): Promise<Paginated<User>> {
  const body = {
    ...take && { take },
    ...skip && { skip },
  };

  const response = await APIHelper.getResource('users', body, {
    pragma: 'no-cache',
    'cache-control': 'no-cache',
  });
  const _pagination = PaginationTransformer.makePagination(response._pagination);
  const records = response.records.map(
    (user: any) => UserTransformer.makeUser(user),
  );

  return { _pagination, records } as Paginated<User>;
}

/**
 * Get the user at the given id using the `users/${id}` endpoint.
 * @param {Number} id The id of the user.
 * @returns {Promise<User>} A promise that resolves to a user.
 * @see User
 */
export async function getUser(id: number) {
  const response = await APIHelper.getResource(`users/${id}`);

  return UserTransformer.makeUser(response);
}

/**
 * Get the organ members of the given user id using the `users/${id}/members`
 * endpoint.
 * @param {Number} id The id of the user.
 * @returns {Promise<User[]>} A promise that resolves to an array of users.
 * @see User
 */
export async function getOrganMembers(id: number): Promise<User[]> {
  const response = await APIHelper.getResource(`users/${id}/members`);

  if (response === undefined || response.records === undefined) {
    return [];
  }

  return response.records.map((res: any) => UserTransformer.makeUser(res));
}
